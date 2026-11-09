/**
 * Controleert op horizontale overloop op alle pagina's en op de
 * breedtes die we ondersteunen.
 *
 * Run: node scripts/check-overflow.mjs [basisUrl]
 */
import { chromium } from 'playwright';

const basis = process.argv[2] ?? 'http://localhost:4322';
const paginas = ['/', '/ambachtswinkel', '/catering', '/vergaderen', '/contact', '/404'];
const breedtes = [320, 390, 768, 1024, 1280, 1440];

const browser = await chromium.launch();
const fouten = [];

for (const breedte of breedtes) {
  const pagina = await browser.newPage({ viewport: { width: breedte, height: 900 } });
  for (const pad of paginas) {
    await pagina.goto(`${basis}${pad}`, { waitUntil: 'networkidle' });
    const uitkomst = await pagina.evaluate(() => {
      const doc = document.documentElement;
      const over = doc.scrollWidth - doc.clientWidth;
      const boos = [];
      if (over > 0) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1)) {
            boos.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} (${Math.round(r.left)} tot ${Math.round(r.right)})`);
          }
          if (boos.length > 4) break;
        }
      }
      return { over, boos };
    });
    if (uitkomst.over > 0) {
      fouten.push(`${pad} op ${breedte}px: ${uitkomst.over}px over (${uitkomst.boos.join(', ')})`);
    }
  }
  await pagina.close();
}

await browser.close();

if (fouten.length > 0) {
  console.log(fouten.map((f) => `FAIL ${f}`).join('\n'));
  process.exit(1);
}
console.log(
  `Geen horizontale overloop op ${paginas.length} pagina's op ${breedtes.length} breedtes.`,
);
