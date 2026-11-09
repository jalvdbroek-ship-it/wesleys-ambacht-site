/**
 * Snijt het beeldmerk uit zijn witte marge en maakt twee varianten:
 * - merk.png: originele kleuren, transparante achtergrond
 * - merk-wit.png: witte silhouet, voor op een donkere vlakte
 *
 * Run: node scripts/crop-logo.mjs
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const bron = path.join(root, 'public', 'images', 'logo.png');

const browser = await chromium.launch();
const pagina = await browser.newPage();

const dataUrl = `data:image/png;base64,${(await readFile(bron)).toString('base64')}`;
await pagina.setContent('<canvas id="c"></canvas>');

const resultaat = await pagina.evaluate(async (url) => {
  const img = new Image();
  img.src = url;
  await img.decode();

  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('geen canvascontext');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  const beeld = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Zoek de grenzen van alles wat niet bijna wit is.
  // De marge van 4 procent laat de zwarte kaderlijn van de
  // oorspronkelijke afbeelding buiten beeld.
  const margeScan = Math.round(Math.min(canvas.width, canvas.height) * 0.04);
  let links = canvas.width;
  let boven = canvas.height;
  let rechts = 0;
  let onder = 0;
  for (let y = margeScan; y < canvas.height - margeScan; y += 1) {
    for (let x = margeScan; x < canvas.width - margeScan; x += 1) {
      const i = (y * canvas.width + x) * 4;
      const r = beeld.data[i];
      const g = beeld.data[i + 1];
      const b = beeld.data[i + 2];
      if (r < 242 || g < 242 || b < 242) {
        if (x < links) links = x;
        if (x > rechts) rechts = x;
        if (y < boven) boven = y;
        if (y > onder) onder = y;
      }
    }
  }

  const marge = 12;
  links = Math.max(0, links - marge);
  boven = Math.max(0, boven - marge);
  rechts = Math.min(canvas.width - 1, rechts + marge);
  onder = Math.min(canvas.height - 1, onder + marge);
  const breedte = rechts - links + 1;
  const hoogte = onder - boven + 1;

  // Variant 1: originele kleuren, witte pixels transparant.
  const origineel = ctx.createImageData(breedte, hoogte);
  for (let y = 0; y < hoogte; y += 1) {
    for (let x = 0; x < breedte; x += 1) {
      const bron = ((y + boven) * canvas.width + (x + links)) * 4;
      const doel = (y * breedte + x) * 4;
      const r = beeld.data[bron];
      const g = beeld.data[bron + 1];
      const b = beeld.data[bron + 2];
      const wit = r > 242 && g > 242 && b > 242;
      origineel.data[doel] = r;
      origineel.data[doel + 1] = g;
      origineel.data[doel + 2] = b;
      origineel.data[doel + 3] = wit ? 0 : 255;
    }
  }
  canvas.width = breedte;
  canvas.height = hoogte;
  ctx.clearRect(0, 0, breedte, hoogte);
  ctx.putImageData(origineel, 0, 0);
  const kleur = canvas.toDataURL('image/png');

  // Variant 2: dezelfde vorm, volledig wit.
  const witVariant = ctx.createImageData(breedte, hoogte);
  for (let i = 0; i < breedte * hoogte; i += 1) {
    const alpha = origineel.data[i * 4 + 3];
    witVariant.data[i * 4] = 255;
    witVariant.data[i * 4 + 1] = 255;
    witVariant.data[i * 4 + 2] = 255;
    witVariant.data[i * 4 + 3] = alpha;
  }
  ctx.clearRect(0, 0, breedte, hoogte);
  ctx.putImageData(witVariant, 0, 0);
  const wit = canvas.toDataURL('image/png');

  return { kleur, wit, breedte, hoogte };
}, dataUrl);

await browser.close();

const naarBestand = (dataUrl) =>
  Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');

await writeFile(path.join(root, 'public', 'images', 'merk.png'), naarBestand(resultaat.kleur));
await writeFile(path.join(root, 'public', 'images', 'merk-wit.png'), naarBestand(resultaat.wit));

console.log(
  `Merk gesneden: ${resultaat.breedte} bij ${resultaat.hoogte} pixels. ` +
    'public/images/merk.png en public/images/merk-wit.png zijn bijgewerkt.',
);
