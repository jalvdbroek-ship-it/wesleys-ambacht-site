/**
 * Maakt de linkkaart (og:image) in de huidige huisstijl.
 *
 * Run: node scripts/build-linkkaart.mjs
 *
 * De kaart is 1200 bij 630 pixels, zonder klantfoto's: alleen het
 * beeldmerk, de tekst en de ring van de haven.
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const merk = `data:image/png;base64,${(await readFile(path.join(root, 'public', 'images', 'merk.png'))).toString('base64')}`;

const patroon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 158c10-8 20-8 30 0s20 8 30 0 20-8 30 0'/%3E%3Cpath d='M12 176c10-8 20-8 30 0s20 8 30 0 20-8 30 0'/%3E%3Cpath d='M142 28c13 0 23 9 23 20s-10 20-23 20-23-9-23-20 10-20 23-20z'/%3E%3Cpath d='M165 48l12-9v18z'/%3E%3Ccircle cx='132' cy='41' r='2'/%3E%3Ccircle cx='46' cy='46' r='19'/%3E%3Cpath d='M46 27v38M27 46h38M33 33l26 26M59 33L33 59'/%3E%3Cpath d='M150 120v32'/%3E%3Ccircle cx='150' cy='114' r='4.5'/%3E%3Cpath d='M137 128h26'/%3E%3Cpath d='M150 152c0 9-7 15-15 15s-15-6-15-15'/%3E%3Cpath d='M150 152c0 9 7 15 15 15s15-6 15-15'/%3E%3C/g%3E%3C/svg%3E\")";

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800&display=swap">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    width: 1200px;
    height: 630px;
    overflow: hidden;
    position: relative;
    background: #ffffff;
    color: #133048;
    font-family: 'Figtree', sans-serif;
  }
  .patroon {
    position: absolute;
    inset: 0;
    background-color: #007176;
    -webkit-mask-image: ${patroon};
    mask-image: ${patroon};
    -webkit-mask-repeat: repeat;
    mask-repeat: repeat;
    -webkit-mask-size: 200px 200px;
    mask-size: 200px 200px;
    opacity: 0.09;
  }
  .ring {
    position: absolute;
    right: -110px;
    bottom: -150px;
    width: 420px;
    height: 420px;
    border: 3px solid #dfe6eb;
    border-radius: 50%;
  }
  .content { position: relative; padding: 72px 80px; }
  .merk { width: 148px; height: auto; display: block; }
  .eyebrow {
    margin: 52px 0 0;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #007176;
  }
  h1 {
    margin: 18px 0 0;
    font-size: 68px;
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.025em;
    max-width: 820px;
  }
  .sub {
    margin: 24px 0 0;
    font-size: 26px;
    line-height: 1.45;
    color: #4b6278;
    max-width: 720px;
  }
  .lijn { margin-top: 34px; width: 96px; height: 4px; background: #007176; }
</style>
</head>
<body>
  <div class="patroon"></div>
  <div class="ring"></div>
  <div class="content">
    <img class="merk" src="${merk}" alt="">
    <p class="eyebrow">Ambachtswinkel in Stellendam</p>
    <h1>Verse vis van de vismijn.<br>Vlees van het vuur.</h1>
    <p class="sub">Ambachtelijke catering op locatie en vergaderen met uitzicht over de buitenhaven.</p>
    <div class="lijn"></div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(500);
await pagina.screenshot({
  path: path.join(root, 'public', 'images', 'linkkaart.png'),
});
await browser.close();

console.log('Linkkaart geschreven: public/images/linkkaart.png (1200 bij 630)');
