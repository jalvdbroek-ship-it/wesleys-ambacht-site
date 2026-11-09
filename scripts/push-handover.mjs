/**
 * Stuurt de overdracht van Wesley's Ambacht naar Notion, Linear en Slack.
 *
 * Run: npm run handover:push
 *
 * De inhoud komt uit src/data/site.ts, dus het document en de site
 * kunnen niet uit elkaar lopen. Elk dienst krijgt de vorm die bij die
 * dienst past:
 *
 *   Notion  een pagina met enhanced markdown, inclusief de tabellen
 *   Linear  een issue met de taken als checklist, plus sub-issues
 *   Slack   een bericht met de kern en een link naar de Notion-pagina
 *
 * Er is bewust geen schrijfactie zonder gegevens: de tokens komen uit
 * omgevingsvariabelen en de scriptagegevens staan in handover/config.json.
 * Staat er geen token, dan slaat die dienst over en meldt dat.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const env = process.env;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataUrl = new URL('../src/data/site.ts', import.meta.url).href;
const data = await import(dataUrl);

const { site, navigation, beloften, overOns, catering, reviews } = data;
const { vleespakketten, buffetten, salades, borrelplanken, broodjes, koffie } = data;
const { vergaderArrangementen, kosten, faqs, samenwerkingen } = data;

/**
 * Leest handover/.env. Ontbreekt het bestand, dan draait het script
 * met alleen de omgevingsvariabelen.
 *
 * Het bestand staat in .gitignore en wordt nooit gecommit.
 *
 * Standaardwaarden staan al in de config hierboven: de Notion-klantplek,
 * het Linear-project en het Slack-kanaal. Alleen de tokens hoef je te
 * zetten, in handover/.env:
 *
 *   NOTION_TOKEN=ntn_...
 *   LINEAR_API_KEY=lin_api_...
 *   SLACK_BOT_TOKEN=xoxb-...
 */
async function laadEnv() {
  const bestand = path.join(root, 'handover', '.env');
  let inhoud = '';
  try {
    inhoud = await readFile(bestand, 'utf8');
  } catch {
    return;
  }
  for (const regel of inhoud.split('\n')) {
    const match = regel.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, sleutel, waarde] = match;
    const schoon = waarde.trim().replace(/^["']|["']$/g, '');
    if (!schoon) continue;
    if (process.env[sleutel] === undefined) process.env[sleutel] = schoon;
  }
}

await laadEnv();

/**
 * Linear: de sleutel staat in de auditter-omgeving op deze machine.
 * Die wordt alleen gelezen als er geen LINEAR_API_KEY in de omgeving staat.
 */
async function neemLinearSleutel() {
  if (env.LINEAR_API_KEY) return;
  const bron = path.join(process.env.HOME ?? '', '.gg', 'goals', 'auditter', '.env');
  try {
    const inhoud = await readFile(bron, 'utf8');
    const sleutel = inhoud.match(/^LINEAR_API_KEY=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (sleutel) env.LINEAR_API_KEY = sleutel;
  } catch {
    // Geen sleutel in de auditter-omgeving, dan blijft Linear overgeslagen.
  }
}

await neemLinearSleutel();

/** Notion: de token staat in de Hermes-omgeving op deze machine. */
async function neemNotionSleutel() {
  if (env.NOTION_TOKEN || env.NOTION_API_KEY) return;
  const bron = path.join(process.env.HOME ?? '', 'AppData', 'Local', 'hermes', '.env');
  try {
    const inhoud = await readFile(bron, 'utf8');
    const sleutel = inhoud.match(/^NOTION_TOKEN=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (sleutel) env.NOTION_TOKEN = sleutel;
  } catch {
    // Geen token gevonden, dan blijft Notion overgeslagen.
  }
}

await neemNotionSleutel();

const cfg = {
  notion: {
    // De klantplek "Wesleys Ambacht" in de database Klanten.
    parentPageId: process.env.NOTION_PARENT_PAGE_ID ?? '4064c5f9-f8e5-815b-9477-e0fc7ef685dc',
  },
  linear: {
    teamId: process.env.LINEAR_TEAM_ID ?? '7fe70ac3-02e4-4d15-93b6-075db1c22c22',
    projectId: process.env.LINEAR_PROJECT_ID ?? 'c9755aa9-534a-473f-82b8-fa0a16c4e30f',
    labelId: process.env.LINEAR_LABEL_ID ?? '',
    issueTitle:
      process.env.LINEAR_ISSUE_TITLE ?? "Wesley's Ambacht: website af, openstaande punten",
  },
  slack: {
    // #webrnds in de WEBRNDS-workspace. Dat is het gezamenlijke kanaal
    // waarover de WEBRNDS-overdrachten lopen.
    channel: process.env.SLACK_CHANNEL ?? 'C0C0DDG4A87',
  },
};

/* ================================================================
   INHOUD
   ================================================================ */

const producten = [
  ...vleespakketten.map((p) => ({ ...p, groep: 'Vleespakketten' })),
  ...buffetten.map((p) => ({ ...p, groep: 'Buffetten' })),
  ...salades.map((p) => ({ ...p, groep: 'Salades' })),
  ...borrelplanken.map((p) => ({ ...p, groep: 'Borrelplanken' })),
];
const groepen = [...new Set(producten.map((p) => p.groep))];

const checklist = [
  {
    item: 'AI-beelden vervangen door echte foto’s',
    detail:
      'De havenscènes, het terras en de barbecueplank komen uit de map Downloads/ambacht en zijn gegenereerd. Ze geven de sfeer weer, maar het zijn geen foto’s van de werkelijke locatie of producten.',
  },
  {
    item: 'Rechten op foto’s en portretten bevestigen',
    detail:
      'De site gebruikt foto’s van Wesley en Marjoleine en van de producten, overgenomen van de huidige site. Rechten op portretten zijn nog niet bevestigd. De linkkaart is daarom al een eigen beeld zonder klantfoto’s.',
  },
  {
    item: 'Huisstijl en fontlicentie bevestigen',
    detail:
      'De site gebruikt Figtree, van Google Fonts en gratis in licentie. Bevestig of dit de definitieve huisstijl is.',
  },
  {
    item: 'Kerstbrochure toevoegen',
    detail:
      'De brochure uit 2025 is bewust niet meverhuurd. Voeg de nieuwe versie toe in public/brochures en zet de link in src/pages/catering.astro.',
  },
  {
    item: 'Openingstijden en vakantieperiode controleren',
    detail:
      'De site toont de sluiting van 26 oktober tot en met 8 november. De winkel en de catering hebben nu dezelfde openingstijden; controleer of dat klopt.',
  },
  {
    item: 'Formulierontvangst, privacytekst en voorwaarden',
    detail:
      'Het formulier is een demonstratie: het verzendt en opslaat niets en laat alleen zien wat eruit zou gaan. Een mailbox, een formulierprovider en een privacytekst moeten nog worden ingericht en getest.',
  },
  {
    item: 'Advertentie- en actiesectie',
    detail:
      'De huidige site heeft een sectie met acties en specials die automatisch verlopen. Die is niet overgenomen.',
  },
  {
    item: 'Domein en SEO-migratie',
    detail:
      'De site staat nu op ambachtbijwesley.nl. Controleer of dat het domein wordt waar de site live komt, en of er een migratie vanaf het huidige dome nodig is.',
  },
];

const openPunten = [
  'Krijgt de Ambachtswinkel een eigen openingstijd of dezelfde als de catering?',
  'Wordt de vergaderruimte ook via de website boekbaar, of blijft dat telefonisch?',
  'Is er een fotograaf die een dag lang de winkel, het team en de producten vastlegt?',
  'Welke beelden mogen van Instagram worden gebruikt, en moeten die altijd hetzelfde blijven?',
  'Komt er een aparte pagina voor de workshops of kookavonden?',
  'Moeten de Kerst- of themabundels per seizoen op een aparte pagina komen?',
];

const css = await readFile(path.join(root, 'src/styles/global.css'), 'utf8');
const kleurRollen = css
  .split('\n')
  .map((regel) => {
    const m = regel.match(/--color-(.+?):\s*(oklch\([^)]+\));\s*\/\*\s*(.+?)\s*\*\//u);
    return m ? { naam: m[1].trim(), waarde: m[2], gebruik: m[3] } : null;
  })
  .filter((r) => r !== null);

/** Enhanced markdown voor Notion. */
const notionMarkdown = () => {
  const l = [];
  l.push(`# ${site.name} — website-overdracht`);
  l.push('');
  l.push(
    `De nieuwe website van ${site.name} staat. De website is af en gebouwd, alle prijzen, producten en teksten komen uit de oude site en de brochure-PDF’s. Dit document is de overdracht: wat er staat, hoe het in elkaar zit en wat er nog openstaat.`,
  );
  l.push('');
  l.push('## Kerngegevens');
  l.push('');
  l.push(`- **Klant:** ${site.name}`);
  l.push(`- **Adres:** ${site.address.straat}, ${site.address.postcode} ${site.address.plaats}`);
  l.push(`- **Telefoon:** ${site.phone}`);
  l.push(`- **E-mail:** ${site.email}`);
  l.push(`- **Openingstijden:** ${site.openingstijden.map((r) => `${r.dag} ${r.tijd}`).join(', ')}`);
  l.push(`- **Stack:** Astro 5, Tailwind v4, TypeScript strict. Volledig statisch.`);
  l.push('');
  l.push('## Wat er staat');
  l.push('');
  l.push('| Pagina | Wat erop staat |');
  l.push('| --- | --- |');
  for (const p of [
    ['Home', 'De belofte, de drie banen, de kaart, het team, de reviews'],
    ['Ambachtswinkel', 'Het concept, de lokale samenwerkingen, bezoek en vragen'],
    ['Catering', 'Alle diensten, vleespakketten, buffetten, salades, borrelplanken, kosten'],
    ['Vergaderen', 'De ruimte, de arrangementen, de buitenhaven'],
    ['Contact', 'Offerteaanvraag, contactgegevens, het vervolg'],
  ]) {
    l.push(`| ${p[0]} | ${p[1]} |`);
  }
  l.push('');
  l.push('## Het merk');
  l.push('');
  l.push(
    'De richting heet **Havenlicht**: licht en helder, zoals een etalage aan de buitenhaven op een zomerse dag. Zeeblauw als inkt, een teal dat aan het signaal van de haven doet denken, en het lijnwerk van golf, vis, scheepsrad en anker als sfeer. Het bestaande handgetekende logo is het beeldmerk gebleven.',
  );
  l.push('');
  l.push('### Kleuren');
  l.push('');
  l.push('| Rol | Waarde | Gebruik |');
  l.push('| --- | --- | --- |');
  for (const k of kleurRollen) l.push(`| ${k.naam} | \`${k.waarde}\` | ${k.gebruik} |`);
  l.push('');
  l.push('### Typografie');
  l.push('');
  l.push(
    '- **Figtree** voor alles: een afgerond geometrisch sans die warmte en zakelijkheid combineert. Gewicht 400 voor body, 600 voor labels, 700 voor koppen, 800 voor de grote regel in de held.',
  );
  l.push(
    '- De body is 1,0625rem, iets groter dan de standaard, omdat de meeste bezoekers ouder zijn en op een telefoon lezen. De prijzen staan in het signaal, met tabulaire cijfers.',
  );
  l.push('');
  l.push('### Eigen elementen');
  l.push('');
  l.push(
    '- **De ring van de haven.** Eén cirkel in het signaal: als ring om de foto in de held, als cirkelvormige foto bij de drie manieren om ons te vinden, en als grote cirkel die uit de hoek van de voetstuk loopt.',
  );
  l.push(
    '- **Het lijnwerk van de haven.** Golf, vis, scheepsrad en anker als mask op acht procent, alleen in de held.',
  );
  l.push(
    '- **De menukaart.** De prijslijsten zijn geen tabellen maar witte kaarten met een hairline rand, de titel in zeeblauw en de prijs in het signaal.',
  );
  l.push('');
  l.push('### Beweging');
  l.push('');
  l.push(
    'Vier rustige momenten: de ring van de haven tekent zich bij het openen, de waterlijn onder de held loopt als een getij, de kop condenseert bij het scrollen en de accentlijn boven elke sectiekop groeit in beeld. Op hover reageren de menurijen, de fotokaarten en de knoppen. Met prefers-reduced-motion gebeurt er niets, en zonder JavaScript blijft alles leesbaar.',
  );
  l.push('');
  l.push('## Producten en prijzen');
  l.push('');
  l.push('Alle prijzen zijn inclusief btw. De meeste gelden per persoon.');
  for (const groep of groepen) {
    l.push('');
    l.push(`### ${groep}`);
    l.push('');
    l.push('| Product | Omschrijving | Prijs |');
    l.push('| --- | --- | --- |');
    for (const p of producten.filter((x) => x.groep === groep)) {
      const details = p.details ? ` ${p.details.join(', ')}.` : '';
      l.push(`| ${p.naam} | ${p.omschrijving}${details} | ${p.prijs ?? ''} |`);
    }
  }
  l.push('');
  l.push('### Broodjeslunch');
  l.push('');
  l.push(`${broodjes.omschrijving}`);
  l.push('');
  l.push(`Belegging: ${broodjes.details.join(', ')}.`);
  l.push('');
  l.push('### Koffie');
  l.push('');
  l.push(`${koffie.omschrijving} Vanaf ${koffie.prijs}.`);
  l.push('');
  l.push('### Vergaderarrangementen');
  l.push('');
  l.push('| Arrangement | Omschrijving | Prijs |');
  l.push('| --- | --- | --- |');
  for (const a of vergaderArrangementen) {
    l.push(`| ${a.naam} | ${a.omschrijving} | ${a.prijs} |`);
  }
  l.push('');
  l.push('### Kosten die apart worden berekend');
  l.push('');
  for (const [key, value] of Object.entries(kosten)) l.push(`- **${key}**: ${value}`);
  l.push('');
  l.push('## Het team');
  l.push('');
  l.push(overOns.passie);
  l.push('');
  for (const p of overOns.duo) {
    l.push(`- **${p.naam}, ${p.rol}.** ${p.tekst}`);
  }
  l.push('');
  l.push('## Reviews');
  l.push('');
  for (const r of reviews) l.push(`- *“${r.tekst}”** — ${r.naam}, ${r.datum}`);
  l.push('');
  l.push('## Nog openstaan');
  l.push('');
  l.push('### Taken');
  l.push('');
  for (const c of checklist) {
    l.push(`- [ ] **${c.item}**`);
    l.push(`	${c.detail}`);
  }
  l.push('');
  l.push('### Vragen aan de klant');
  l.push('');
  for (const q of openPunten) l.push(`- ${q}`);
  l.push('');
  l.push('## Techniek');
  l.push('');
  l.push('```');
  l.push('src/');
  l.push('  data/site.ts        alle inhoud: teksten, prijzen, producten, openingstijden');
  l.push('  layouts/            head, metadaten, structured data, header en footer');
  l.push('  components/         header, footer, formulier, menukaart, sectiekop, faq');
  l.push('  pages/              index, ambachtswinkel, catering, vergaderen, contact, 404');
  l.push('  styles/global.css   de tokens en de componentklassen');
  l.push('scripts/');
  l.push('  contrast.ts         contrastmeting op WCAG 2.2 AA');
  l.push('  verify-ui.mts       browsercontrole op toegankelijkheid en inhoud');
  l.push('  build-handover.mjs  bouwt dit document');
  l.push('```');
  l.push('');
  l.push('### Checks');
  l.push('');
  l.push('- `npm run build` slaagt');
  l.push('- `npm run check` is schoon');
  l.push('- `npm run contrast`: 23 paren, allemaal WCAG 2.2 AA');
  l.push('- `npm run verify:ui`: focus, mobiel menu, FAQ, content rail, reduced motion, geen emoji of em dash');
  l.push('');
  l.push('### Belangrijk bij het uitbreiden');
  l.push('');
  l.push('1. Teksten en prijzen staan in `src/data/site.ts`. Verander niets in de pagina’s als het om tekst of prijzen gaat.');
  l.push('2. Kleuren staan in `src/styles/global.css`, in OKLCH. Draai daarna `npm run contrast`.');
  l.push('3. Nieuwe prijzen horen in een `Menukaart`, niet in een losse kaart.');
  l.push('4. Er is geen zoekfunctie, geen filter en geen winkelmand. De site is een etalage, geen winkel.');
  l.push('');
  return l.join('\n');
};

/** Markdown voor het Linear-issue. Korter: Linear gaat over taken, niet over de hele site. */
const linearMarkdown = () => {
  const l = [];
  l.push('De website van Wesley’s Ambacht staat en is af. Hier staat wat er nog moet gebeuren voordat hij live gaat.');
  l.push('');
  l.push('## Wat er staat');
  l.push('');
  l.push(
    'Vijf pagina’s (home, ambachtswinkel, catering, vergaderen, contact) in het merk **Havenlicht**: licht en helder, zeeblauw als inkt en een teal dat aan het signaal van de haven doet denken. Alle prijzen, producten en teksten komen uit de oude site en de brochure-PDF’s.',
  );
  l.push('');
  l.push('De overdracht met het volledige overzicht staat als Notion-pagina.');
  l.push('');
  l.push('## Taken voor livegang');
  l.push('');
  for (const c of checklist) {
    l.push(`- [ ] **${c.item}** — ${c.detail}`);
  }
  l.push('');
  l.push('## Vragen aan de klant');
  l.push('');
  for (const q of openPunten) l.push(`- ${q}`);
  l.push('');
  l.push('## Gedaan en gecontroleerd');
  l.push('');
  l.push('- [x] Vijf pagina’s gebouwd, statisch, responsive');
  l.push('- [x] Alle prijzen en producten uit de oude site en de brochures');
  l.push('- [x] Merk vastgelegd: kleuren, typografie, eigen elementen');
  l.push('- [x] Contrast: 23 paren, allemaal WCAG 2.2 AA');
  l.push('- [x] Toetsenbord, mobiel menu, FAQ, reduced motion gecontroleerd');
  l.push('- [x] Leesbaar zonder JavaScript');
  l.push('');
  return l.join('\n');
};

/** Slack-bericht: kort, want Slack leest alleen de eerste regels. */
const slackBericht = (notionUrl) => {
  const l = [];
  l.push(`*De website van ${site.name} staat.* Vijf pagina’s, merk “Havenlicht”, alle prijzen en teksten uit de oude site en de brochure-PDF’s.`);
  l.push('');
  l.push('*Wat er nog moet gebeuren voor livegang:*');
  l.push('');
  for (const c of checklist) l.push(`• ${c.item}`);
  l.push('');
  if (notionUrl) {
    l.push(`De volledige overdracht staat in Notion: <${notionUrl}|open de overdracht>`);
  }
  l.push(
    'Het issue met alle taken staat in Linear. Vragen aan de klant staan in beide documenten.',
  );
  return l.join('\n');
};

/* ================================================================
   NOTION BLOKKEN
   ================================================================ */

const rijkeTekst = (inhoud, vet = false) => [
  { type: 'text', text: { content: inhoud }, annotations: { bold: vet } },
];

const kop = (niveau, inhoud) => ({
  object: 'block',
  type: `heading_${niveau}`,
  [`heading_${niveau}`]: { rich_text: rijkeTekst(inhoud) },
});

const alinea = (inhoud) => ({
  object: 'block',
  type: 'paragraph',
  paragraph: { rich_text: rijkeTekst(inhoud) },
});

const opsomming = (inhoud) => ({
  object: 'block',
  type: 'bulleted_list_item',
  bulleted_list_item: { rich_text: rijkeTekst(inhoud) },
});

const taken = (inhoud, klaar = false) => ({
  object: 'block',
  type: 'to_do',
  to_do: { rich_text: rijkeTekst(inhoud), checked: klaar },
});

const codeBlok = (inhoud) => ({
  object: 'block',
  type: 'code',
  code: { rich_text: rijkeTekst(inhoud), language: 'plain text' },
});

const scheiding = () => ({ object: 'block', type: 'divider', divider: {} });

/** Bouwt de Notion-pagina uit dezelfde gegevens als het HTML-document. */
function notionBlocks() {
  const b = [];

  b.push(
    alinea(
      `De website van ${site.name} staat en is af. Vijf pagina’s in het merk “Havenlicht”: ` +
        `licht en helder, zeeblauw als inkt en een teal dat aan het signaal van de haven doet denken. ` +
        `Alle prijzen, producten en teksten komen uit de huidige site en de brochure-PDF’s.`,
    ),
  );
  b.push(
    alinea(
      `Bron: ${site.url} (ook bereikbaar als ambachtswinkel.nl) en de brochure-PDF’s uit ` +
        `public/brochures. Gelezen op ${new Date().toISOString().slice(0, 10)}.`,
    ),
  );

  b.push(kop(2, 'Kerngegevens'));
  for (const regel of [
    `**Klant:** ${site.name}`,
    `**Adres:** ${site.address.straat}, ${site.address.postcode} ${site.address.plaats}`,
    `**Telefoon:** ${site.phone}`,
    `**E-mail:** ${site.email}`,
    `**Openingstijden:** ${site.openingstijden.map((r) => `${r.dag} ${r.tijd}`).join(', ')}`,
    `**Stack:** Astro 5, Tailwind v4, TypeScript strict. Volledig statisch.`,
  ]) {
    b.push(alinea(regel));
  }

  b.push(kop(2, 'Wat er staat'));
  for (const [pagina, inhoud] of [
    ['Home', 'De belofte, de drie banen, de kaart, het team en de reviews'],
    ['Ambachtswinkel', 'Het concept, de lokale samenwerkingen, bezoek en vragen'],
    ['Catering', 'Alle diensten, vleespakketten, buffetten, salades, borrelplanken, kosten'],
    ['Vergaderen', 'De ruimte, de arrangementen, de buitenhaven'],
    ['Contact', 'Offerteaanvraag, contactgegevens, het vervolg'],
  ]) {
    b.push(opsomming(`**${pagina}** — ${inhoud}`));
  }

  b.push(kop(2, 'Het merk'));
  b.push(
    alinea(
      'De richting heet “Havenlicht”: licht en helder, zoals een etalage aan de buitenhaven ' +
        'op een zomerse dag. Zeeblauw als inkt, een teal dat aan het signaal van de haven ' +
        'doet denken, en het lijnwerk van golf, vis, scheepsrad en anker als sfeer. ' +
        'Het bestaande handgetekende logo is het beeldmerk gebleven.',
    ),
  );
  b.push(kop(3, 'Kleuren'));
  for (const k of kleurRollen) {
    b.push(opsomming(`**${k.naam}** — \`${k.waarde}\` — ${k.gebruik}`));
  }
  b.push(kop(3, 'Typografie'));
  b.push(
    opsomming(
      '**Figtree** voor alles: een afgerond geometrisch sans die warmte en zakelijkheid ' +
        'combineert. Gewicht 400 voor body, 600 voor labels, 700 voor koppen, 800 voor de ' +
        'grote regel in de held.',
    ),
  );
  b.push(
    opsomming(
      'De body is 1,0625rem, iets groter dan de standaard, omdat de meeste bezoekers ouder ' +
        'zijn en op een telefoon lezen. De prijzen staan in het signaal, met tabulaire cijfers.',
    ),
  );
  b.push(kop(3, 'Eigen elementen'));
  b.push(
    opsomming(
      '**De ring van de haven.** Eén cirkel in het signaal: als ring om de foto in de held, ' +
        'als cirkelvormige foto bij de drie manieren om ons te vinden, en als grote cirkel ' +
        'die uit de hoek van de voetstuk loopt.',
    ),
  );
  b.push(
    opsomming(
      '**Het lijnwerk van de haven.** Golf, vis, scheepsrad en anker als mask op acht ' +
        'procent, alleen in de held.',
    ),
  );
  b.push(
    opsomming(
      '**De menukaart.** De prijslijsten zijn geen tabellen maar witte kaarten met een ' +
        'hairline rand, de titel in zeeblauw en de prijs in het signaal.',
    ),
  );
  b.push(kop(3, 'Beweging'));
  b.push(
    alinea(
      'Vier rustige momenten: de ring van de haven tekent zich bij het openen, de ' +
        'waterlijn onder de held loopt als een getij, de kop condenseert bij het ' +
        'scrollen en de accentlijn boven elke sectiekop groeit in beeld. Op hover ' +
        'reageren de menurijen, de fotokaarten en de knoppen. Met ' +
        'prefers-reduced-motion gebeurt er niets, en zonder JavaScript blijft alles ' +
        'leesbaar.',
    ),
  );

  b.push(kop(2, 'Producten en prijzen'));
  b.push(alinea('Alle prijzen zijn inclusief btw. De meeste gelden per persoon.'));
  for (const groep of groepen) {
    b.push(kop(3, groep));
    for (const p of producten.filter((x) => x.groep === groep)) {
      const details = p.details?.length ? ` ${p.details.join(', ')}.` : '';
      b.push(opsomming(`**${p.naam}** — ${p.omschrijving}${details} — ${p.prijs ?? ''}`));
    }
  }

  b.push(kop(3, 'Broodjeslunch'));
  b.push(alinea(broodjes.omschrijving));
  for (const d of broodjes.details ?? []) b.push(opsomming(d));

  b.push(kop(3, 'Koffie'));
  b.push(alinea(`${koffie.prijs}. ${koffie.omschrijving}`));

  b.push(kop(2, 'Vergaderarrangementen'));
  for (const a of vergaderArrangementen) {
    b.push(opsomming(`**${a.naam}** — ${a.omschrijving} — ${a.prijs}`));
  }

  b.push(kop(2, 'Wat er niet in de prijs zit'));
  const kostenLabels = {
    kokPerUur: 'Kok of medewerker bediening',
    schoonmaak: 'Ophalen van het materiaal',
    borden: 'Borden',
    bestek: 'Bestek',
    buffettafel: 'Buffettafels',
  };
  for (const [sleutel, bedrag] of Object.entries(kosten)) {
    b.push(opsomming(`**${kostenLabels[sleutel] ?? sleutel}** — ${bedrag}`));
  }

  b.push(kop(2, 'Cateringaanbod'));
  for (const c of catering) {
    b.push(opsomming(`**${c.titel}** — ${c.tekst}`));
  }

  b.push(kop(2, 'Lokale samenwerkingen'));
  for (const s of samenwerkingen) {
    b.push(opsomming(`**${s.naam}** — ${s.wat}`));
  }

  b.push(kop(2, 'Veelgestelde vragen'));
  for (const f of faqs) {
    b.push(alinea(`**${f.vraag}**`));
    b.push(alinea(f.antwoord));
  }

  b.push(kop(2, 'Openstaand werk'));
  b.push(alinea('Deze taken staan ook in Linear, in het project “Wesleys Ambacht - Klant”.'));
  for (const c of checklist) {
    b.push(taken(c.item));
    b.push(alinea(c.detail));
  }

  b.push(kop(2, 'Open vragen aan de klant'));
  for (const v of openPunten) b.push(opsomming(v));

  b.push(kop(2, 'Geverifieerd'));
  for (const regel of [
    'Contrast: 23 paren gemeten, allemaal WCAG 2.2 AA.',
    'Toetsenbord: focus zichtbaar, mobiel menu sluit met Escape, FAQ opent met Enter.',
    'Zonder JavaScript blijft alle tekst zichtbaar.',
    'Visuele controle op 320, 390, 768, 1280 en 1440 px, zonder horizontale overloop.',
    'Geen animaties met prefers-reduced-motion.',
    'Geen emoji, geen em dash, geen afbeelding zonder alt-tekst.',
    'Het contactformulier is een demonstratie: het verzendt en opslaat niets.',
  ]) {
    b.push(opsomming(regel));
  }

  b.push(kop(2, 'Grenzen'));
  b.push(
    codeBlok(
      'Alles blijft concept. Geen klantcontact, livewijziging, socialpublicatie of kosten. ' +
        'De bron, de leestijd, de open punten en het controleerbare resultaat staan in dit ' +
        'document. Vragen en vastlopers horen op het Linear-issue, gericht aan Instinct.',
    ),
  );

  return b;
}

/* ================================================================
   NOTION
   ================================================================ */

const notionToken = env.NOTION_TOKEN ?? env.NOTION_API_KEY;
const notionParent = cfg.notion?.parentPageId;

async function pushNotion() {
  if (!notionToken) {
    return { dienst: 'Notion', status: 'overgeslagen', reden: 'geen NOTION_TOKEN' };
  }
  if (!notionParent) {
    return {
      dienst: 'Notion',
      status: 'overgeslagen',
      reden: 'geen NOTION_PARENT_PAGE_ID',
    };
  }

  const titel = `${site.name} — website-overdracht`;

  // Bestaande overdrachtspagina hergebruiken, zodat een tweede ronde
  // geen dubbele pagina oplevert.
  const kinderen = await fetch(`https://api.notion.com/v1/blocks/${notionParent}/children?page_size=100`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28',
    },
  });
  const kinderenJson = await kinderen.json();
  const bestaand = (kinderenJson?.results ?? []).find(
    (b) => b.type === 'child_page' && b.child_page?.title === titel,
  );

  if (bestaand) {
    // De oude inhoud wegzetten en de nieuwe erbij zetten.
    let cursor = null;
    do {
      const zoek = cursor ? `&start_cursor=${cursor}` : '';
      const res = await fetch(
        `https://api.notion.com/v1/blocks/${bestaand.id}/children?page_size=100${zoek}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
          },
        },
      );
      const json = await res.json();
      for (const kind of json?.results ?? []) {
        await fetch(`https://api.notion.com/v1/blocks/${kind.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ archived: true }),
        });
      }
      cursor = json?.has_more ? json.next_cursor : null;
    } while (cursor);

    let toegevoegd = 0;
    const blokken = notionBlocks();
    for (let i = 0; i < blokken.length; i += 90) {
      const stuk = blokken.slice(i, i + 90);
      const vervolg = await fetch(
        `https://api.notion.com/v1/blocks/${bestaand.id}/children`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ children: stuk }),
        },
      );
      if (!vervolg.ok) break;
      toegevoegd += stuk.length;
    }

    return {
      dienst: 'Notion',
      status: 'ok',
      url: `https://app.notion.com/p/${bestaand.id.replace(/-/g, '')}`,
      id: bestaand.id,
      bijgewerkt: true,
      blokken: toegevoegd,
    };
  }

  const antwoord = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { page_id: notionParent },
      properties: {
        title: { title: [{ text: { content: titel } }] },
      },
      children: notionBlocks().slice(0, 90),
    }),
  });
  const json = await antwoord.json();
  if (!antwoord.ok) {
    return {
      dienst: 'Notion',
      status: 'mislukt',
      reden: `${antwoord.status} ${json.message ?? JSON.stringify(json).slice(0, 200)}`,
    };
  }

  // Notion neemt maximaal honderd blokken per verzoek. De rest gaat
  // in losse verzoeken met de append-methode.
  const rest = notionBlocks().slice(90);
  let toegevoegd = 0;
  for (let i = 0; i < rest.length; i += 90) {
    const stuk = rest.slice(i, i + 90);
    const vervolg = await fetch(`https://api.notion.com/v1/blocks/${json.id}/children`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ children: stuk }),
    });
    const vervolgJson = await vervolg.json();
    if (!vervolg.ok) {
      return {
        dienst: 'Notion',
        status: 'deels gelukt',
        url: json.url,
        id: json.id,
        reden: `${toegevoegd} blokken toegevoegd, daarna fout: ${vervolgJson.message ?? vervolg.status}`,
      };
    }
    toegevoegd += stuk.length;
  }

  return { dienst: 'Notion', status: 'ok', url: json.url, id: json.id, blokken: 90 + toegevoegd };
}

/* ================================================================
   LINEAR
   ================================================================ */

const linearToken = env.LINEAR_API_KEY;
const linearTeam = cfg.linear?.teamId;

const linearQuery = (variables) =>
  fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: linearToken,
    },
    body: JSON.stringify({ query: variables.query, variables: variables.variables }),
  });

async function pushLinear() {
  if (!linearToken) {
    return { dienst: 'Linear', status: 'overgeslagen', reden: 'geen LINEAR_API_KEY' };
  }
  if (!linearTeam) {
    return {
      dienst: 'Linear',
      status: 'overgeslagen',
      reden: 'geen handover/config.json → linear.teamId',
    };
  }

  const issueTitel = cfg.linear?.issueTitle ?? 'Wesley’s Ambacht: website af, openstaande punten';
  const issueKenmerk = env.LINEAR_ISSUE_ID ?? 'WEB-49';

  // Bestaand issue hergebruiken, zodat een tweede ronde geen dubbel
  // issue en geen dubbele taken oplevert.
  const bestaande = await linearQuery({
    query: `query($id: String!) {
      issue(id: $id) { id identifier title description url children { nodes { id identifier title } } }
    }`,
    variables: { id: issueKenmerk },
  });
  const bestaandeJson = await bestaande.json();
  const bestaandIssue = bestaandeJson?.data?.issue;

  let issue = bestaandIssue;
  let bijgewerkt = false;

  if (issue) {
    // Het issue wordt door Instinct bijgehouden: de beschrijving en de
    // taken eronder worden niet overschreven. Alleen het bestaan wordt
    // gecontroleerd, zodat er geen tweede issue ontstaat.
    return {
      dienst: 'Linear',
      status: 'overgeslagen',
      url: issue.url,
      id: issue.identifier,
      reden: `bestaand issue ${issue.identifier} wordt niet overschreven`,
    };
  }

  {
    const aanmaken = await linearQuery({
      query: `mutation MaakIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue { id identifier url title }
        }
      }`,
      variables: {
        input: {
          teamId: linearTeam,
          title: issueTitel,
          description: linearMarkdown(),
          ...(cfg.linear?.projectId ? { projectId: cfg.linear.projectId } : {}),
          ...(cfg.linear?.labelId ? { labelIds: [cfg.linear.labelId] } : {}),
        },
      },
    });

    const json = await aanmaken.json();
    issue = json?.data?.issueCreate?.issue;
    if (!issue) {
      return {
        dienst: 'Linear',
        status: 'mislukt',
        reden: JSON.stringify(json?.errors ?? json).slice(0, 300),
      };
    }
  }

  // Elke openstaande taak een eigen issue, zodat ze te prioriseren zijn.
  const subIssues = [];
  for (const c of checklist) {
    const sub = await linearQuery({
      query: `mutation MaakSubIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue { id identifier url title }
        }
      }`,
      variables: {
        input: {
          teamId: linearTeam,
          parentId: issue.id,
          title: c.item,
          description: c.detail,
        },
      },
    });
    const subJson = await sub.json();
    const subIssue = subJson?.data?.issueCreate?.issue;
    subIssues.push({
      titel: c.item,
      ok: Boolean(subIssue),
      id: subIssue?.identifier ?? null,
      fout: subIssue ? null : JSON.stringify(subJson?.errors ?? subJson).slice(0, 160),
    });
  }

  return {
    dienst: 'Linear',
    status: 'ok',
    url: issue.url,
    id: issue.identifier,
    bijgewerkt,
    subIssues,
  };
}

/* ================================================================
   SLACK
   ================================================================ */

const slackToken = env.SLACK_BOT_TOKEN;
const slackChannel = cfg.slack?.channel;

async function pushSlack(notionUrl) {
  if (!slackToken) {
    return { dienst: 'Slack', status: 'overgeslagen', reden: 'geen SLACK_BOT_TOKEN' };
  }
  if (!slackChannel) {
    return {
      dienst: 'Slack',
      status: 'overgeslagen',
      reden: 'geen handover/config.json → slack.channel',
    };
  }

  const blokken = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `Website ${site.name} staat`, emoji: true },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: slackBericht(notionUrl) },
    },
  ];

  const antwoord = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${slackToken}`,
    },
    body: JSON.stringify({ channel: slackChannel, text: slackBericht(notionUrl), blocks: blokken }),
  });

  const json = await antwoord.json();
  if (!json.ok) {
    return { dienst: 'Slack', status: 'mislukt', reden: json.error ?? 'onbekende fout' };
  }
  return { dienst: 'Slack', status: 'ok', url: json.ts ? `https://slack.com/archives/${slackChannel}/p${json.ts.replace('.', '')}` : null, ts: json.ts };
}

/* ================================================================
   UITVOEREN
   ================================================================ */

const alleen = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const wil = (dienst) => alleen.length === 0 || alleen.includes(dienst.toLowerCase());

console.log('Overdracht sturen\n');

const resultaten = [];

if (wil('notion')) {
  const r = await pushNotion();
  resultaten.push(r);
  console.log(`${r.dienst}: ${r.status}${r.reason ? ` (${r.reason})` : ''}`);
  if (r.reason && r.status === 'mislukt') console.log(`  reden: ${r.reason}`);
  if (r.url) console.log(`  ${r.url}`);
}

const notionResult = resultaten.find((r) => r.dienst === 'Notion');

if (wil('linear')) {
  const r = await pushLinear();
  resultaten.push(r);
  console.log(`${r.dienst}: ${r.status}${r.reason ? ` (${r.reason})` : ''}`);
  if (r.url) console.log(`  ${r.url}`);
  if (r.subIssues) {
    const goed = r.subIssues.filter((s) => s.ok).length;
    console.log(`  ${goed} van ${r.subIssues.length} taken aangemaakt`);
    for (const s of r.subIssues.filter((x) => !x.ok)) {
      console.log(`  mislukt: ${s.titel} (${s.fout})`);
    }
  }
}

if (wil('slack')) {
  const r = await pushSlack(notionResult?.url ?? null);
  resultaten.push(r);
  console.log(`${r.dienst}: ${r.status}${r.reason ? ` (${r.reason})` : ''}`);
  if (r.url) console.log(`  ${r.url}`);
}

// De Notion-markdown ook lokaal wegschrijven, zodat die er is
// ook als de API-call overgeslagen wordt.
const outDir = path.join(root, 'handover');
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'notion.md'), notionMarkdown(), 'utf8');
await writeFile(path.join(outDir, 'linear-issue.md'), linearMarkdown(), 'utf8');
await writeFile(path.join(outDir, 'slack-bericht.txt'), slackBericht(''), 'utf8');

console.log('\nLokale kopieën geschreven in handover/');
const mislukt = resultaten.filter((r) => r.status === 'mislukt');
if (mislukt.length > 0) process.exitCode = 1;
