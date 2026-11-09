/**
 * Screenshots van de gebouwde site, na het doorlopen van de pagina
 * zodat de scroll-onthulling is afgerond.
 *
 * Run: node scripts/shots.mjs [basisUrl] [uitvoermap]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const basis = process.argv[2] ?? 'http://localhost:4322';
const uitvoer = process.argv[3] ?? '.gg/screenshots';
const paginas = ['/', '/ambachtswinkel', '/catering', '/vergaderen', '/contact', '/404'];

await mkdir(uitvoer, { recursive: true });

const browser = await chromium.launch();

for (const [naam, viewport] of [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobiel', { width: 390, height: 844 }],
]) {
  const pagina = await browser.newPage({ viewport });
  for (const pad of paginas) {
    await pagina.goto(`${basis}${pad}`, { waitUntil: 'networkidle' });
    await pagina.evaluate(async () => {
      // Zonder dit scrolt de pagina glad en komt hij nergens.
      document.documentElement.style.scrollBehavior = 'auto';
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });

    // Wacht tot de held-animatie klaar is.
    await pagina.waitForTimeout(1100);

    // Lazy geladen beelden moeten binnen zijn voor de volledige
    // screenshot: anders blijven ze leeg.
    await pagina.evaluate(async () => {
      const afbeeldingen = Array.from(document.images);
      for (const afbeelding of afbeeldingen) {
        if (!afbeelding.complete) {
          try {
            await afbeelding.decode();
          } catch {
            // Een gebroken afbeelding is een echte fout, geen laadfout.
          }
        }
      }
    });
    await pagina.waitForTimeout(600);
    const naamPad = pad === '/' ? 'home' : pad.replace('/', '').replace('/', '-');
    await pagina.screenshot({
      path: path.join(uitvoer, `${naam}-${naamPad}.png`),
      fullPage: true,
    });
    console.log(`${naam}-${naamPad}.png`);
  }
  await pagina.close();
}

await browser.close();
