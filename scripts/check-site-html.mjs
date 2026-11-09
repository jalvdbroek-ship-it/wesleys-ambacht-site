/**
 * Controleert de zelfstandige HTML-bestanden: laden de afbeeldingen,
 * is de CSS aanwezig en is er geen horizontale overloop?
 *
 * Run: node scripts/check-site-html.mjs
 */
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const map = path.join(root, 'handover', 'site');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const fouten = [];

for (const bestand of readdirSync(map).filter((f) => f.endsWith('.html'))) {
  const url = new URL(`file:///${path.join(map, bestand).split(path.sep).join('/')}`);
  await page.goto(url.href, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const kapotte = imgs
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.getAttribute('src'));
    return {
      kapotte,
      imgTotaal: imgs.length,
      achtergrond: getComputedStyle(document.body).backgroundColor,
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 40) ?? '(geen h1)',
      overloop: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      htmlLinks: Array.from(document.querySelectorAll('a[href$=".html"]')).length,
    };
  });

  console.log(
    `${bestand.padEnd(22)} h1="${info.h1}" | afbeeldingen ${info.imgTotaal} (kapot ${info.kapotte.length}) | ` +
      `achtergrond ${info.achtergrond} | overloop ${info.overloop} | links ${info.htmlLinks}`,
  );
  if (info.kapotte.length > 0) {
    fouten.push(`${bestand}: kapotte afbeeldingen ${info.kapotte.join(', ')}`);
  }
  if (info.overloop) {
    fouten.push(`${bestand}: horizontale overloop`);
  }
}

await browser.close();
console.log(
  fouten.length > 0 ? `\nFOUTEN:\n${fouten.join('\n')}` : '\nAlle bestanden zijn compleet en laden goed.',
);
process.exit(fouten.length > 0 ? 1 : 0);
