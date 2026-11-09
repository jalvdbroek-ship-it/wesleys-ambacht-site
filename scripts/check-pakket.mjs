/**
 * Controleert het herbruikbare pakket: uitpakken, de HTML openen en
 * kijken of alles laadt.
 *
 * Run: node scripts/check-pakket.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const zip = path.join(root, 'handover', 'wesleys-ambacht-website.zip');
const map = path.join(os.tmpdir(), 'wesleys-pakket-controle');

if (!existsSync(zip)) {
  console.error('Het pakket bestaat niet. Draai eerst npm run site:zip.');
  process.exit(1);
}

rmSync(map, { recursive: true, force: true });
execFileSync('powershell', [
  '-NoProfile',
  '-Command',
  `Expand-Archive -Path "${zip}" -DestinationPath "${map}" -Force`,
]);

// De structuur.
const verwacht = ['LEES-MIJ-ERBIJ.txt', 'website', 'bron'];
const fouten = [];
for (const item of verwacht) {
  if (!existsSync(path.join(map, item))) fouten.push(`ontbreekt: ${item}`);
}

const website = path.join(map, 'website');
const htmlBestanden = readdirSync(website).filter((f) => f.endsWith('.html'));
for (const pagina of [
  'index.html',
  'ambachtswinkel.html',
  'catering.html',
  'vergaderen.html',
  'contact.html',
  '404.html',
]) {
  if (!htmlBestanden.includes(pagina)) fouten.push(`ontbreekt: website/${pagina}`);
}

// De broncode.
for (const item of ['src', 'public', 'package.json', 'astro.config.mjs', 'DESIGN.md']) {
  if (!existsSync(path.join(map, 'bron', item))) fouten.push(`ontbreekt: bron/${item}`);
}

// De HTML in een browser openen en kijken of alles laadt.
const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const kapotteVerwijzingen = [];
pagina.on('response', (r) => {
  if (r.status() >= 400) kapotteVerwijzingen.push(`${r.status()} ${r.url()}`);
});

for (const bestand of htmlBestanden) {
  if (bestand === 'index-overzicht.html') continue;
  await pagina.goto(`file:///${path.join(website, bestand).replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle',
  });
  // Door de hele pagina lopen, zodat de lazy geladen beelden binnenkomen.
  await pagina.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await pagina.waitForTimeout(700);
  const uitkomst = await pagina.evaluate(async () => {
    for (const afbeelding of Array.from(document.images)) {
      if (!afbeelding.complete) {
        try {
          await afbeelding.decode();
        } catch {
          // Een gebroken afbeelding is een echte fout, geen laadfout.
        }
      }
    }
    const afbeeldingen = Array.from(document.images);
    return {
      kapot: afbeeldingen.filter((i) => !i.complete || i.naturalWidth === 0).length,
      totaal: afbeeldingen.length,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      overloop: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      hoogte: document.body.scrollHeight,
    };
  });
  console.log(
    `${bestand.padEnd(24)} h1="${uitkomst.h1.slice(0, 40)}" ` +
      `afbeeldingen ${uitkomst.totaal - uitkomst.kapot}/${uitkomst.totaal} ` +
      `overloop ${uitkomst.overloop} hoogte ${uitkomst.hoogte}`,
  );
  if (uitkomst.kapot > 0) fouten.push(`${bestand}: ${uitkomst.kapot} kapotte afbeelding(en)`);
  if (uitkomst.overloop > 0) fouten.push(`${bestand}: ${uitkomst.overloop}px horizontale overloop`);
  if (uitkomst.hoogte < 800) fouten.push(`${bestand}: de pagina is niet volledig (${uitkomst.hoogte}px)`);
}

await browser.close();
rmSync(map, { recursive: true, force: true });

if (kapotteVerwijzingen.length > 0) {
  for (const v of kapotteVerwijzingen) fouten.push(`kapotte verwijzing: ${v}`);
}

if (fouten.length > 0) {
  console.error('\nHet pakket heeft problemen:');
  for (const fout of fouten) console.error(`  ${fout}`);
  process.exit(1);
}

console.log(
  `\nHet pakket werkt volledig: ${htmlBestanden.length - 1} pagina's, media en broncode compleet.`,
);
console.log(`Grootte: ${(statSync(zip).size / 1024 / 1024).toFixed(1)} MB`);
