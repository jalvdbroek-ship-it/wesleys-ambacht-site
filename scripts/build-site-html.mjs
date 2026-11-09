/**
 * Maakt zelfstandige HTML-bestanden van de gebouwde website.
 *
 * De bestanden in dist/ zijn statisch, maar verwijzen met absolute paden
 * naar /images en naar de andere paginas. Voor een preview die je los
 * kunt openen, worden die paden relatief gemaakt en gaat de CSS inline.
 *
 * Run: node scripts/build-site-html.mjs
 */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const uit = path.join(root, 'handover', 'site');

/** De paginas van de site, met het bestand in dist en de uitgangsnaam. */
const paginas = [
  { bestand: 'index.html', naam: 'index', titel: 'Home' },
  { bestand: 'ambachtswinkel/index.html', naam: 'ambachtswinkel', titel: 'Ambachtswinkel' },
  { bestand: 'catering/index.html', naam: 'catering', titel: 'Catering' },
  { bestand: 'vergaderen/index.html', naam: 'vergaderen', titel: 'Vergaderen' },
  { bestand: 'contact/index.html', naam: 'contact', titel: 'Contact' },
  { bestand: '404.html', naam: '404', titel: 'Niet gevonden' },
];

/** Alle CSS uit de gebouwde assets, samengevoegd tot één blok. */
async function cssSamenvoegen() {
  const assets = path.join(dist, '_astro');
  const bestanden = await readdir(assets);
  const css = [];
  for (const bestand of bestanden) {
    if (!bestand.endsWith('.css')) continue;
    css.push(await readFile(path.join(assets, bestand), 'utf8'));
  }
  return css.join('\n');
}

const css = await cssSamenvoegen();

/** Maakt de paden relatief en verwijdert de Astro-build-artefacten. */
function maakZelfstandig(html) {
  let uit = html;

  // CSS inline zetten en de externe stylesheet-link weghalen.
  uit = uit.replace(/<link[^>]*rel="stylesheet"[^>]*href="\/_astro\/[^"]*"[^>]*>\s*/g, '');
  uit = uit.replace(
    /<\/head>/,
    `  <style>\n${css}\n  </style>\n  </head>`,
  );

  // Interne links naar de andere paginas, zodat ze werken als los bestand.
  for (const pagina of paginas) {
    uit = uit.split(`href="/${pagina.naam}"`).join(`href="${pagina.naam}.html"`);
    uit = uit.split(`href="/${pagina.naam}/"`).join(`href="${pagina.naam}.html"`);
  }
  uit = uit.split('href="/contact"').join('href="contact.html"');
  uit = uit.split('href="/catering"').join('href="catering.html"');
  uit = uit.split('href="/vergaderen"').join('href="vergaderen.html"');
  uit = uit.split('href="/ambachtswinkel"').join('href="ambachtswinkel.html"');
  uit = uit.split('href="/"').join('href="index.html"');

  // Afbeeldingen en brochures naar de projectmap, zodat ze lokaal laden.
  uit = uit.split('"/images/').join('"../../public/images/');
  uit = uit.split('"/brochures/').join('"../../public/brochures/');
  uit = uit.split('href="/images/').join('href="../../public/images/');
  uit = uit.split('href="/brochures/').join('href="../../public/brochures/');

  // De canonical url en og:image horen bij de live site, niet bij dit bestand.
  uit = uit.replace(/<link rel="canonical"[^>]*>\s*/g, '');
  uit = uit.replace(/<meta property="og:(url|image|type|site_name)"[^>]*>\s*/g, '');
  uit = uit.replace(/<meta name="twitter:image"[^>]*>\s*/g, '');

  // De favicon verwijst naar een bestand dat niet naast dit bestand staat.
  uit = uit.split('href="/favicon.png"').join('href="../../public/favicon.png"');
  uit = uit.split('href="/apple-touch-icon.png"').join('href="../../public/apple-touch-icon.png"');

  return uit;
}

await rm(uit, { recursive: true, force: true });
await mkdir(uit, { recursive: true });

const overzicht = [];

for (const pagina of paginas) {
  const bron = await readFile(path.join(dist, pagina.bestand), 'utf8');
  const zelfstandig = maakZelfstandig(bron);
  const doel = path.join(uit, `${pagina.naam}.html`);
  await writeFile(doel, zelfstandig, 'utf8');
  overzicht.push({ ...pagina, grootte: zelfstandig.length });
  console.log(`${pagina.naam}.html  ${(zelfstandig.length / 1024).toFixed(1)} kB`);
}

// Een index die de vijf paginas aan elkaar koppelt.
const navigatie = overzicht
  .map((p) => `      <li><a href="${p.naam}.html">${p.titel}</a> <span>${p.grootte} bytes</span></li>`)
  .join('\n');

await writeFile(
  path.join(uit, 'index-overzicht.html'),
  `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wesley's Ambacht — website in HTML</title>
  <style>
    body { background: #ffffff; color: #133048; font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif;
      line-height: 1.7; margin: 0; padding: 3rem 1.5rem; }
    main { max-width: 44rem; margin: 0 auto; }
    h1 { font-family: inherit; font-weight: 800; font-size: 2rem; letter-spacing: -0.025em; }
    p { color: #4b6278; }
    ul { list-style: none; padding: 0; }
    li { border-top: 1px solid #dfe6eb; padding: 0.875rem 0;
      display: flex; justify-content: space-between; gap: 1rem; }
    a { color: #007176; text-decoration: none; }
    a:hover { text-decoration: underline; }
    span { color: #4b6278; font-size: 0.875rem; }
    code { color: #006067; }
  </style>
</head>
<body>
  <main>
    <h1>Wesley's Ambacht — de website in HTML</h1>
    <p>
      De vijf paginas van de website, elk als zelfstandig HTML-bestand. De CSS staat
      inline, de afbeeldingen verwijzen naar <code>../../public/images/</code> in de
      projectmap. Open een bestand om de pagina te zien, precies zoals hij nu is.
    </p>
    <ul>
${navigatie}
    </ul>
    <p>
      De broncode van de site zelf (Astro, Tailwind, TypeScript) staat in de projectmap.
      Teksten en prijzen staan in <code>src/data/site.ts</code>, de kleuren en typografie
      in <code>src/styles/global.css</code>.
    </p>
  </main>
</body>
</html>
`,
  'utf8',
);

console.log('\nindex-overzicht.html geschreven');
console.log(`Map: ${uit}`);
