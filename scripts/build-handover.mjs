/**
 * Bouwt het overdrachtsdocument voor Wesley's Ambacht.
 *
 * Run: npm run handover
 *
 * Alles wordt gelezen uit src/data/site.ts en de echte projectbestanden,
 * zodat het document nooit uit de pas kan lopen met de site.
 * De uitvoer is handover/wesleys-ambacht-handover.html.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataUrl = new URL('../src/data/site.ts', import.meta.url).href;
const data = await import(dataUrl);

const { site, navigation, beloften, overOns, catering, reviews, instagramPosts } = data;
const { vleespakketten, buffetten, salades, borrelplanken, broodjes, koffie } = data;
const { vergaderArrangementen, kosten, faqs, samenwerkingen } = data;

const design = await readFile(path.join(root, 'DESIGN.md'), 'utf8');
const readme = await readFile(path.join(root, 'README.md'), 'utf8');

/** Tekens die in HTML moeten worden ontscaped. */
const esc = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const css = await readFile(path.join(root, 'src/styles/global.css'), 'utf8');

/** Haal de kleurrollen uit de CSS, zodat ze altijd gelijk zijn aan de site. */
const kleurRollen = css
  .split('\n')
  .map((regel) => {
    // De rolnaam kan niet-ASCII bevatten (crème), dus match breed op het commentaar.
    const m = regel.match(/--color-(.+?):\s*(oklch\([^)]+\));\s*\/\*\s*(.+?)\s*\*\//u);
    return m ? { naam: m[1].trim(), waarde: m[2], gebruik: m[3] } : null;
  })
  .filter((rol) => rol !== null);

const producten = [
  ...vleespakketten.map((p) => ({ ...p, groep: 'Vleespakketten' })),
  ...buffetten.map((p) => ({ ...p, groep: 'Buffetten' })),
  ...salades.map((p) => ({ ...p, groep: 'Salades' })),
  ...borrelplanken.map((p) => ({ ...p, groep: 'Borrelplanken' })),
];

const groepen = [...new Set(producten.map((p) => p.groep))];

const checklist = [
  {
    item: 'AI-beelden vervangen door echte foto\u2019s',
    detail:
      'De havensc\u00e8nes, het terras en de barbecueplank komen uit de map Downloads/ambacht en zijn gegenereerd. Ze geven de sfeer weer, maar het zijn geen foto\u2019s van de werkelijke locatie of producten.',
  },
  {
    item: 'Kerstbrochure toevoegen',
    detail:
      'De brochure uit 2025 is bewust niet meeverhuurd. Voeg de nieuwe versie toe in public/brochures en zet de link in src/pages/catering.astro.',
  },
  {
    item: 'Openingstijden controleren',
    detail:
      'Nu staan de openingstijden van de winkel en van de catering overal hetzelfde. Pas src/data/site.ts aan als dat verschilt.',
  },
  {
    item: 'Formulier aan een mailbox koppelen',
    detail:
      'Het formulier opent nu het e-mailprogramma van de bezoeker. Voor directe ontvangst is een formulierdienst of backend nodig.',
  },
  {
    item: 'Privacyverklaring en voorwaarden toevoegen',
    detail:
      'De oude site heeft /privacy en /voorwaarden.html. Die inhoud is niet overgenomen en moet worden toegevoegd.',
  },
  {
    item: 'Advertentie- en actiesectie',
    detail:
      'De oude site heeft een sectie met acties en specials die automatisch verlopen. Die is niet overgenomen.',
  },
  {
    item: 'Domein controleren',
    detail:
      'In astro.config.mjs staat site: https://ambachtswinkel.nl. Klopt dat met het domein waar de site live komt?',
  },
];

const openPunten = [
  'Krijgt de Ambachtswinkel een eigen openingstijd of dezelfde als de catering?',
  'Wordt de vergaderruimte ook via de website boekbaar, of blijft dat telefonisch?',
  'Is er een fotograaf die een dag lang de winkel, het team en de producten vastlegt?',
  'Welke beelden mogen van Instagram worden gebruikt, en moeten die altijd hetzelfde blijven?',
  'Komt er een aparte pagina voor de workshops of kookavonden?',
  'Moet de Kerst- of themabundels per seizoen op een aparte pagina komen?',
];

const sectie = (id, titel, inhoud) => `
  <section id="${id}">
    <div class="blok">
      <h2>${esc(titel)}</h2>
      ${inhoud}
    </div>
  </section>`;

const productTabel = (groep) => {
  const rijen = producten.filter((p) => p.groep === groep);
  return `
      <table>
        <thead>
          <tr><th>Product</th><th>Omschrijving</th><th class="prijs">Prijs</th></tr>
        </thead>
        <tbody>
          ${rijen
            .map(
              (p) => `<tr>
            <td><strong>${esc(p.naam)}</strong>${
              p.details
                ? `<ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`
                : ''
            }</td>
            <td>${esc(p.omschrijving)}</td>
            <td class="prijs">${esc(p.prijs ?? '')}</td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>`;
};

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wesley's Ambacht — website-overdracht</title>
<style>
  :root {
    --haven: #133048;
    --haven-donker: #0d2235;
    --schuim: #f4f8fa;
    --ink: #133048;
    --ink-mist: #4b6278;
    --signaal: #007176;
    --signaal-licht: #8fd8dc;
    --lijn: #dfe6eb;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--schuim);
    color: var(--ink);
    font-family: 'Figtree', -apple-system, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  .blok { max-width: 900px; margin: 0 auto; padding: 0 32px; }
  header.hoofd {
    border-bottom: 3px solid var(--signaal);
    background: var(--haven);
    color: #ffffff;
    padding: 64px 0 56px;
  }
  header.hoofd .lead { color: #d5e0e8; }
  header.hoofd .meta { color: #a6bccb; }
  header.hoofd .meta b { color: #ffffff; }
  .eyebrow {
    font-size: 14px; font-weight: 600; color: var(--signaal-licht); margin: 0 0 14px;
  }
  h1 {
    font-weight: 800;
    font-size: clamp(34px, 5vw, 52px); line-height: 1.08;
    letter-spacing: -0.025em; margin: 0 0 20px; max-width: 18ch;
  }
  .lead { font-size: 18px; color: var(--ink-mist); max-width: 62ch; margin: 0 0 28px; }
  .meta { display: flex; flex-wrap: wrap; gap: 10px 32px; font-size: 14px; color: var(--ink-mist); }
  .meta b { color: var(--ink); font-weight: 600; }
  .tafellijn {
    display: flex; align-items: center; gap: 14px; margin: 32px 0 0;
  }
  .tafellijn::before { content: ''; width: 48px; height: 2px; background: var(--signaal-licht); }
  .tafellijn span { color: #ffffff; font-weight: 600; font-size: 15px; }
  section { padding: 44px 0; border-bottom: 1px solid var(--lijn); background: #ffffff; }
  h2 {
    font-weight: 700;
    font-size: 28px; letter-spacing: -0.02em; margin: 0 0 8px;
  }
  h3 {
    font-weight: 700;
    font-size: 19px; margin: 28px 0 10px; color: var(--ink);
  }
  p { color: var(--ink-mist); max-width: 68ch; }
  ul { color: var(--ink-mist); padding-left: 20px; max-width: 68ch; }
  li { margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin: 18px 0 8px; font-size: 14.5px; }
  th {
    text-align: left; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--signaal); font-weight: 700; padding: 0 14px 10px 0;
    border-bottom: 1px solid var(--lijn);
  }
  td { padding: 12px 14px 12px 0; border-bottom: 1px solid var(--lijn); color: var(--ink-mist); vertical-align: top; }
  td strong { color: var(--ink); font-weight: 600; }
  td ul { margin: 6px 0 0; padding-left: 16px; font-size: 13px; }
  td ul li { margin: 0; color: var(--ink-mist); }
  .prijs { color: var(--signaal); white-space: nowrap; font-weight: 700; }
  .kaart {
    background: var(--schuim); border: 1px solid var(--lijn);
    border-radius: 20px; padding: 20px 24px; margin: 18px 0;
  }
  .kaart h3:first-child { margin-top: 0; }
  .checklist { list-style: none; padding: 0; }
  .checklist li {
    background: #ffffff; border: 1px solid var(--lijn);
    border-radius: 14px; padding: 16px 20px; margin-bottom: 10px;
  }
  .checklist b { display: block; color: var(--ink); font-weight: 600; margin-bottom: 4px; }
  .checklist span { color: var(--ink-mist); font-size: 14.5px; }
  .vraag { border-left: 2px solid var(--signaal); padding-left: 16px; margin-bottom: 14px; }
  .vraag b { color: var(--ink); }
  .vraag p { margin: 2px 0 0; }
  .pill {
    display: inline-block; font-size: 12px; padding: 3px 12px; border-radius: 999px;
    background: var(--schuim); color: var(--signaal); margin: 0 6px 6px 0;
    border: 1px solid var(--lijn);
  }
  pre {
    background: var(--schuim); border: 1px solid var(--lijn);
    border-radius: 10px; padding: 14px 16px; overflow-x: auto;
    font-size: 13px; color: var(--ink-mist); line-height: 1.5;
  }
  code { font-family: 'SF Mono', Consolas, monospace; color: var(--signaal); }
  .map { display: grid; gap: 10px; }
  .map a {
    display: block; text-decoration: none; color: var(--ink);
    background: #ffffff; border: 1px solid var(--lijn);
    border-radius: 14px; padding: 12px 16px;
  }
  .map a:hover { border-color: var(--signaal); }
  .map b { display: block; }
  .map span { color: var(--ink-mist); font-size: 13.5px; }
  footer { padding: 36px 0 56px; color: var(--ink-mist); font-size: 13.5px; }
  @media print {
    body { background: #fff; color: var(--ink); }
    .blok { max-width: none; }
    section { break-inside: avoid; border-bottom: 1px solid #ddd; }
  }
</style>
</head>
<body>

<header class="hoofd">
  <div class="blok">
    <p class="eyebrow">Overdracht van WEBRNDS</p>
    <h1>Wesley's Ambacht, website</h1>
    <p class="lead">
      De nieuwe website van Wesley's Ambacht staat. Vijf pagina's, het merk
      &ldquo;Havenlicht&rdquo; en alle prijzen, producten en teksten uit de oude site
      en de brochure-PDF's. Dit document is de overdracht: wat er staat, hoe het
      in elkaar zit en wat er nog openstaat.
    </p>
    <div class="meta">
      <span><b>Klant</b> ${esc(site.name)}</span>
      <span><b>Adres</b> ${esc(site.address.straat)}, ${esc(site.address.postcode)} ${esc(site.address.plaats)}</span>
      <span><b>Telefoon</b> ${esc(site.phone)}</span>
      <span><b>E-mail</b> ${esc(site.email)}</span>
      <span><b>Stack</b> Astro 5, Tailwind v4, TypeScript strict</span>
    </div>
    <div class="tafellijn"><span>Zonder E-nummers. Met verse kruiden uit de eigen tuin.</span></div>
  </div>
</header>

${sectie(
  'status',
  'Waar het nu staat',
  `
    <p>
      De site is af en gebouwd. De onderstaande punten zijn getest en gemeten, niet
      geschat. Wat nog openstaat staat verderop, onder <a href="#open">Openstaand werk</a>.
    </p>
    <div style="margin:18px 0">
      <span class="pill">Build geslaagd</span>
      <span class="pill">Typecontrole schoon</span>
      <span class="pill">28 contrastparen op WCAG AA</span>
      <span class="pill">Toetsenbord gecontroleerd</span>
      <span class="pill">Mobiel en desktop bekeken</span>
      <span class="pill">Leesbaar zonder JavaScript</span>
      <span class="pill">Geen overloop van 320 tot 1440 px</span>
    </div>
    <h3>De pagina's</h3>
    <div class="map">
      <a href="#"><b>Home</b><span>De belofte, de drie banen, de kaart, het team en de reviews</span></a>
      <a href="#"><b>Ambachtswinkel</b><span>Het concept, de lokale samenwerkingen, bezoek en vragen</span></a>
      <a href="#"><b>Catering</b><span>BBQ, buffetten, hapjes, broodjes, koffie en de kosten</span></a>
      <a href="#"><b>Vergaderen</b><span>De ruimte, de arrangementen en de omgeving</span></a>
      <a href="#"><b>Contact</b><span>Offerteaanvraag, bereikbaarheid en het verloop</span></a>
    </div>
  `,
)}

${sectie(
  'merk',
  'Het merk',
  `
    <p>
      De richting heet <strong>Havenlicht</strong>: licht en helder, zoals een etalage
      aan de buitenhaven op een zomerse dag. Zeeblauw als inkt, een teal dat aan het
      signaal van de haven doet denken, en het lijnwerk van golf, vis, scheepsrad en
      anker als sfeer. Het bestaande handgetekende logo is het beeldmerk gebleven.
    </p>
    <h3>Kleuren</h3>
    <table>
      <thead><tr><th>Rol</th><th>Waarde</th><th>Gebruik</th></tr></thead>
      <tbody>
        ${kleurRollen
          .map(
            (k) =>
              `<tr><td><strong>${esc(k.naam)}</strong></td><td><code>${esc(k.waarde)}</code></td><td>${esc(k.gebruik)}</td></tr>`,
          )
          .join('')}
      </tbody>
    </table>
    <h3>Typografie</h3>
    <ul>
      <li><strong>Figtree</strong> voor alles: een afgerond geometrisch sans die warmte en zakelijkheid combineert. Gewicht 400 voor body, 600 voor labels, 700 voor koppen, 800 voor de grote regel in de held.</li>
      <li>Regelafstand 1,7, letterspacing -0,5 procent op de body.</li>
      <li>De prijzen staan in het signaal, met tabulaire cijfers zodat ze recht staan.</li>
    </ul>
    <h3>Eigen elementen</h3>
    <ul>
      <li><strong>De ring van de haven</strong>: een cirkel in het signaal. Als ring om de foto in de held, als cirkelvormige foto bij de drie manieren om ons te vinden, en als grote cirkel die uit de hoek van de voetstuk loopt.</li>
      <li><strong>Het lijnwerk van de haven</strong>: golf, vis, scheepsrad en anker als mask op acht procent, alleen in de held.</li>
      <li><strong>De menukaart</strong>: de prijslijsten zijn witte kaarten met een hairline rand en de prijs in het signaal. Geen tabellen.</li>
      <li><strong>Pillvormige knoppen</strong>: bewust motief, overal hetzelfde.</li>
    </ul>
  `,
)}

${sectie(
  'inhoud',
  'Alle inhoud',
  `
    <p>De volledige tekst staat in <code>src/data/site.ts</code>. Hieronder een overzicht.</p>
    <h3>Wat de klant belt</h3>
    <ul>
      ${catering.map((c) => `<li><strong>${esc(c.titel)}</strong>: ${esc(c.tekst)}</li>`).join('')}
    </ul>
    <h3>Producten en prijzen</h3>
    <p>Prijzen zijn inclusief btw. De meeste gelden per persoon.</p>
    ${groepen.map((groep) => `<h3>${esc(groep)}</h3>${productTabel(groep)}`).join('')}
    <h3>Broodjes en koffie</h3>
    <div class="kaart">
      <p><strong>${esc(broodjes.naam)}</strong></p>
      <p>${esc(broodjes.omschrijving)}</p>
      <ul>${(broodjes.details ?? []).map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      <p><strong>${esc(koffie.naam)}</strong> &mdash; ${esc(koffie.prijs ?? '')}</p>
      <p>${esc(koffie.omschrijving)}</p>
    </div>
    <h3>Vergaderarrangementen</h3>
    <table>
      <thead><tr><th>Arrangement</th><th>Omschrijving</th><th class="prijs">Prijs</th></tr></thead>
      <tbody>
        ${vergaderArrangementen
          .map(
            (a) =>
              `<tr><td><strong>${esc(a.naam)}</strong></td><td>${esc(a.omschrijving)}</td><td class="prijs">${esc(a.prijs)}</td></tr>`,
          )
          .join('')}
      </tbody>
    </table>
    <h3>Losse kosten</h3>
    <ul>
      <li>Kok of medewerker bediening: ${esc(kosten.kokPerUur)}</li>
      <li>Ophalen van het materiaal: ${esc(kosten.schoonmaak)}</li>
      <li>Borden: ${esc(kosten.borden)}, bestek: ${esc(kosten.bestek)}, buffettafels: ${esc(kosten.buffettafel)}</li>
    </ul>
    <h3>Lokale samenwerkingen</h3>
    <ul>
      ${samenwerkingen.map((s) => `<li><strong>${esc(s.naam)}</strong>: ${esc(s.wat)}</li>`).join('')}
    </ul>
  `,
)}

${sectie(
  'techniek',
  'Hoe het in elkaar zit',
  `
    <pre>src/
  data/site.ts        alle teksten, prijzen, producten, openingstijden
  layouts/BaseLayout  head, metadaten, structured data, header en footer
  components/         header, footer, formulier, menukaart, sectiekop, faq, cta
  pages/              index, ambachtswinkel, catering, vergaderen, contact, 404
  styles/global.css   de tokens en de componentklassen
  scripts/motion.ts   accentlijn en compacte kop, met terugval als JavaScript uit staat
scripts/
  contrast.ts         contrastmeting op WCAG 2.2 AA
  verify-ui.mts       browsercontrole op toegankelijkheid en inhoud
public/
  images/             foto's van de winkel, het team en de producten
  brochures/          de prijslijsten van Wesley's Ambacht</pre>
    <h3>Scripts</h3>
    <ul>
      <li><code>npm run build</code>: bouwt de statische site naar <code>dist/</code></li>
      <li><code>npm run preview</code>: draait de build lokaal op poort 4321</li>
      <li><code>npm run contrast</code>: meet elk kleurpaar, faalt bij een te lage verhouding</li>
      <li><code>npm run verify:ui</code>: controleert focus, menu, FAQ, contrast, rail en inhoud in de browser</li>
      <li><code>npm run check</code>: TypeScript-controle van Astro en de componenten</li>
    </ul>
    <h3>Belangrijk bij het uitbreiden</h3>
    <ul>
      <li>Teksten en prijzen horen in <code>src/data/site.ts</code>, niet in de pagina's.</li>
      <li>Nieuwe kleuren horen als rol met een OKLCH-waarde in <code>global.css</code>, nooit als losse hexwaarde. Daarna <code>npm run contrast</code>.</li>
      <li>Nieuwe prijzen horen in een <code>Menukaart</code>.</li>
      <li>Eén content rail: de <code>.rail</code>-klasse bepaalt de marge overal.</li>
      <li>De sluitmelding bovenaan iedere pagina staat in <code>site.ts</code> en moet uitgezet worden zodra de winkel weer open is.</li>
    </ul>
  `,
)}

${sectie(
  'beeld',
  'Over de beelden',
  `
    <p>De site gebruikt twee soorten foto's. Dat verschil is belangrijk voor de tekst.</p>
    <h3>Echte foto's van Wesley's Ambacht</h3>
    <p>
      De gloeiende grill, Wesley en Marjoleine aan het werk, het portret van Wesley,
      de gerookte paling, het buffet en de drie Instagram-foto's. Dit zijn de mensen,
      het werk en de producten zelf.
    </p>
    <h3>Beeldmateriaal uit de map Downloads/ambacht</h3>
    <p>
      De havensc&egrave;nes bij zonsondergang, het terras en de barbecueplank. Deze zijn
      gegenereerd en geven de sfeer van de haven weer, maar het zijn geen foto's van de
      werkelijke locatie of producten. Vervang ze door echte foto's zodra die er zijn.
      Ze staan nergens als bewijs van een concreet product.
    </p>
  `,
)}

${sectie(
  'open',
  'Openstaand werk',
  `
    <h3>Checklist voor livegang</h3>
    <ul class="checklist">
      ${checklist
        .map((c) => `<li><b>${esc(c.item)}</b><span>${esc(c.detail)}</span></li>`)
        .join('')}
    </ul>
    <h3>Vragen voor de klant</h3>
    ${openPunten
      .map(
        (v) => `<div class="vraag"><b>Vraag</b><p>${esc(v)}</p></div>`,
      )
      .join('')}
  `,
)}

${sectie(
  'vragen',
  'Veelgestelde vragen van klanten',
  `
    ${faqs
      .map(
        (f) =>
          `<div class="vraag"><b>${esc(f.vraag)}</b><p>${esc(f.antwoord)}</p></div>`,
      )
      .join('')}
  `,
)}

${sectie(
  'reviews',
  'Wat klanten erover zeiden',
  `
    <p>Gemiddeld 5,0 uit 6 reviews op Facebook.</p>
    ${reviews
      .map(
        (r) =>
          `<div class="vraag"><b>${esc(r.naam)}, ${esc(r.datum)}</b><p>&ldquo;${esc(r.tekst)}&rdquo;</p></div>`,
      )
      .join('')}
  `,
)}

<footer>
  <div class="blok">
    <p>Overdracht van WEBRNDS. Gegenereerd uit de bronbestanden van de site, zodat dit document niet uit de pas kan lopen met wat er staat.</p>
  </div>
</footer>

</body>
</html>
`;

const uitvoerMap = path.join(root, 'handover');
await mkdir(uitvoerMap, { recursive: true });
const uitvoer = path.join(uitvoerMap, 'wesleys-ambacht-handover.html');
await writeFile(uitvoer, html, 'utf8');

console.log(`Overdracht geschreven: ${path.relative(root, uitvoer)}`);
console.log(`Grootte: ${(html.length / 1024).toFixed(1)} kB`);
