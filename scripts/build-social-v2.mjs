/**
 * Bouwt de social media-beelden van Wesley's Ambacht, versie 2.
 *
 * Run: node scripts/build-social-v2.mjs
 *
 * Het verschil met versie 1 is het achtergrondpatroon. In versie 1 was
 * het lijnwerk van de haven een CSS-mask met een SVG die op een andere
 * maat werd getekend dan de tegel. Chromium tekent daarbij op elke
 * tegelgrens een haarlijn, waardoor er horizontale strepen over de
 * achtergrond kwamen. In versie 2 is het patroon een vooraf gerasterde
 * tegel: geen mask, geen schaalverschil, dus geen naden.
 *
 * De beelden komen in `social/posts-v2/`. De opmaak en de teksten
 * staan in dit bestand; de inhoud komt uit src/data/site.ts en de
 * beelden uit public/images.
 */
import { execFile } from 'node:child_process';
import { mkdir, writeFile, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const EDGE =
  process.env.EDGE_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const FORMATS = [
  { naam: 'telefoon', label: 'instagram-feed', breedte: 1080, hoogte: 1350 },
  { naam: 'vierkant', label: 'instagram-square', breedte: 1080, hoogte: 1080 },
  { naam: 'desktop', label: 'facebook-banner', breedte: 1200, hoogte: 630 },
];

const UIT = path.join(root, 'social', 'posts-v2');
const TMP = path.join(root, '.gg', 'social-v2-tmp');

/* ------------------------------------------------------------------ */
/* Teksten                                                             */
/* ------------------------------------------------------------------ */

const contact = {
  telefoon: '06 39 58 11 28',
  handle: '@ambachtswinkel',
  site: 'ambachtbijwesley.nl',
};

/** De ene actie die elke post vraagt. */
const CTA = 'Vraag een offerte aan';

const POSTS = [
  {
    slug: 'vuur-en-vis',
    layout: 'foto-vol',
    foto: 'hero.jpg',
    positie: 'center 45%',
    eyebrow: 'Ambachtswinkel in Stellendam',
    titel: ['Verse vis van de', 'vismijn. Vlees', 'van het vuur.'],
    sub: 'Ambachtelijke catering op locatie en vergaderen met uitzicht over de buitenhaven.',
    caption:
      'De vismijn om de hoek, de rookoven in de winkel. Wij maken vis die over de kade komt en vlees dat over het vuur gaat. Kom langs aan de buitenhaven in Stellendam of vraag een offerte voor catering op locatie.',
  },
  {
    slug: 'zelf-gerookt',
    layout: 'cirkel',
    foto: 'gerookte-paling.jpeg',
    positie: 'center 72%',
    eyebrow: 'Uit de eigen rookoven',
    titel: ['Zelf gerookt.', 'Zelf gemaakt.'],
    sub: 'Zalm en paling langzaam gerookt, zonder kunstmatige toevoegingen.',
    caption:
      'Wesley rookt zijn eigen zalm en paling: langzaam, zonder kunstmatige toevoegingen. Vraag ernaar in de winkel, het is er niet altijd.',
  },
  {
    slug: 'bbq-op-locatie',
    layout: 'cirkel',
    foto: 'Wesley-BBQ-op-locatie.jpeg',
    positie: 'center 35%',
    eyebrow: 'BBQ op locatie',
    titel: ['Wij zetten op.', 'Jullie gaan zitten.'],
    sub: 'Volledig verzorgd, met of zonder bediening. Eigen barbecue of de onze.',
    prijs: 'Vanaf 10 personen',
    caption:
      'BBQ op locatie: wij brengen het materiaal, zetten op en zorgen dat alles klaarstaat. Kok en bediening kunnen wij regelen. Vanaf 10 personen.',
  },
  {
    slug: 'verse-broodjes',
    layout: 'foto-boven',
    foto: 'instagram-2.jpg',
    positie: 'center 45%',
    eyebrow: 'Verse broodjes',
    titel: ['Belegd met', 'eigen producten.'],
    sub: 'Gerookte zalm, huisgerookte paling, pulled pork en ambachtelijke worst. Vers brood van Bakkerij van Harberden.',
    caption:
      'Verse broodjes, belegd met onze eigen producten. Ideaal voor een lunch of een event. Wij leveren ook op locatie.',
  },
  {
    slug: 'ambachtelijke-worst',
    layout: 'foto-vol',
    foto: 'instagram-4.jpeg',
    positie: 'center 40%',
    eyebrow: 'Uit onze eigen keuken',
    titel: ['Ambachtelijke worst.', 'Zonder E-nummers.'],
    sub: 'Kipsaté, shaslick, speklap en BBQ worst. Zelfgemaakt in de winkel aan de haven.',
    caption:
      'Kipsaté, shaslick, speklap en BBQ worst: alles zelfgemaakt, zonder E-nummers. Geen poespas, wel eerlijk eten.',
  },
  {
    slug: 'borrelplanken',
    layout: 'lijst',
    foto: 'barbecueplank.jpg',
    positie: 'center 50%',
    eyebrow: 'Borrelplanken',
    titel: ['De plank die alles heeft.'],
    sub: 'Vanaf tien personen, een dag van tevoren bestellen.',
    regels: [
      ['Grillworst, charcuterie, kaas', '€ 6,50 p.p.'],
      ['Speksoorten, charcuterie, kaas', '€ 10,00 p.p.'],
      ['Speksoorten, charcuterie, kaas en gerookte zalm', '€ 12,50 p.p.'],
      ['Speksoorten, charcuterie, kaas, gerookte paling en olijven', '€ 15,00 p.p.'],
    ],
    caption:
      'Borrelplanken vanaf € 6,50 per persoon. Grillworst, charcuterie, kaas en onze eigen gerookte zalm en paling. Vanaf 10 personen, een dag van tevoren bestellen.',
  },
  {
    slug: 'buffetten',
    layout: 'lijst',
    foto: 'ambachtelijke-buffetten.jpeg',
    positie: 'center 55%',
    eyebrow: 'Buffetten en arrangementen',
    titel: ['Van stamppot tot warm buffet.'],
    sub: 'Volledig verzorgd, met brood, smeersels, fruitsalade en sauzen. Vanaf tien personen.',
    regels: [
      ['Stamppotbuffet basis', '€ 17,00 p.p.'],
      ['Stamppotbuffet luxe', '€ 22,50 p.p.'],
      ['Warm buffet', '€ 24,00 p.p.'],
      ['BBQ buffet luxe', '€ 23,50 p.p.'],
    ],
    caption:
      'Buffetten vanaf € 17,00 per persoon: stamppot, warm buffet of BBQ-arrangement. Alles is inclusief, kok en bediening regelen wij erbij.',
  },
  {
    slug: 'vergaderen',
    layout: 'donker-typografie',
    eyebrow: 'Vergaderen met uitzicht',
    titel: ['120 per dagdeel.'],
    sub: 'Een ingerichte ruimte met uitzicht over de buitenhaven van Stellendam.',
    punten: [
      'Flipover en whiteboard, op aanvraag een beamer',
      'Koffie-, lunch- en borrelarrangementen erbij',
      'Koffie-arrangement vanaf € 11,50 p.p.',
    ],
    caption:
      'Vergaderen met uitzicht over de buitenhaven? De ruimte is € 120 per dagdeel, inclusief flipover en whiteboard. Koffie en lunch erbij kan.',
  },
  {
    slug: 'open-vandaag',
    layout: 'lijst',
    foto: 'Wesley-bar.jpeg',
    positie: 'center 28%',
    eyebrow: 'De Ambachtswinkel',
    titel: ['Di t/m za, 10:00 tot 18:00.'],
    sub: 'Verse vis, ambachtelijke producten en verse broodjes aan de buitenhaven.',
    regels: [
      ['Dinsdag t/m vrijdag', '10:00 tot 18:00'],
      ['Zaterdag', '10:00 tot 18:00'],
      ['Zondag en maandag', 'Gesloten'],
    ],
    cta: 'Bel of loop binnen',
    caption:
      'De winkel is dinsdag tot en met zaterdag open van 10:00 tot 18:00. Kom langs aan de buitenhaven in Stellendam voor verse vis en ambachtelijke producten.',
  },
  {
    slug: 'verse-kruiden',
    layout: 'foto-boven',
    foto: 'wesley-marjoleine-werken.jpeg',
    positie: 'center 40%',
    eyebrow: 'Wesley en Marjoleine',
    titel: ['Verse kruiden uit de tuin.'],
    sub: 'Marjoleine haalt de kruiden uit de eigen tuin achter de winkel en maakt de gerechten af. Geen poespas, wel eerlijk eten.',
    caption:
      'Verse kruiden uit de tuin achter de winkel. Marjoleine maakt de gerechten af, Wesley bepaalt het vuur. Samen aan het werk, elke dag.',
  },
];

/* ------------------------------------------------------------------ */
/* De merkvis                                                          */
/* ------------------------------------------------------------------ */

const visSvg = `
<svg viewBox="0 0 120 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 36c16-21 46-27 64-13 7 6 12 13 15 13s8-7 15-13c-4 9-4 17 0 26-7-6-12-13-15-13s-8 7-15 13C56 63 26 57 10 36Z" fill="#007176"/>
  <circle cx="30" cy="30" r="4.5" fill="#ffffff"/>
  <path d="M4 68c7-6 14-6 21 0s14 6 21 0 14-6 21 0 14 6 21 0 14-6 21 0" stroke="#007176" stroke-width="5" stroke-linecap="round"/>
</svg>`;

/* De vis op een donkere vlakte, in wit. */
const visSvgWit = `
<svg viewBox="0 0 120 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 36c16-21 46-27 64-13 7 6 12 13 15 13s8-7 15-13c-4 9-4 17 0 26-7-6-12-13-15-13s-8 7-15 13C56 63 26 57 10 36Z" fill="#ffffff"/>
  <circle cx="30" cy="30" r="4.5" fill="#0b2133"/>
  <path d="M4 68c7-6 14-6 21 0s14 6 21 0 14-6 21 0 14 6 21 0 14-6 21 0" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
</svg>`;

/* Het lijnwerk van de haven als tegel.
   De tegel wordt vooraf gerasterd, zodat Chromium geen mask hoeft te
   tekenen en er geen haarlijnen op de tegelgrens ontstaan. */
const patroonSvg = `
<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
  <g fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'>
    <path d='M12 158c10-8 20-8 30 0s20 8 30 0 20-8 30 0'/>
    <path d='M12 176c10-8 20-8 30 0s20 8 30 0 20-8 30 0'/>
    <path d='M142 28c13 0 23 9 23 20s-10 20-23 20-23-9-23-20 10-20 23-20z'/>
    <path d='M165 48l12-9v18z'/>
    <circle cx='132' cy='41' r='2'/>
    <circle cx='46' cy='46' r='19'/>
    <path d='M46 27v38M27 46h38M33 33l26 26M59 33L33 59'/>
    <path d='M150 120v32'/>
    <circle cx='150' cy='114' r='4.5'/>
    <path d='M137 128h26'/>
    <path d='M150 152c0 9-7 15-15 15s-15-6-15-15'/>
    <path d='M150 152c0 9 7 15 15 15s15-6 15-15'/>
  </g>
</svg>`;

/**
 * Rastert het lijnwerk van de haven als een tegel-PNG met de gewenste
 * kleur. De tegel is 200 bij 200 en wordt zonder schaling gebruikt.
 */
async function patroonTegel(kleur, alpha) {
  const svg = patroonSvg
    .replace("stroke='white'", `stroke='${kleur}'`)
    .replace('<g ', `<g opacity='${alpha}' `);

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return `url("data:image/png;base64,${png.toString('base64')}")`;
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const css = `
:root {
  --haven: #133048;
  --haven-donker: #0b2133;
  --signaal: #007176;
  --signaal-licht: #8fd3cf;
  --koper: #c4834f;
  --mist: #516a80;
  --lijn: #dfe6eb;
  --patroon: #dcebf5;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
}

body {
  font-family: 'Figtree', 'Segoe UI', sans-serif;
  color: var(--haven);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Achtergrond met het lijnwerk van de haven.
   De tegel ligt er los over, zodat er geen mask nodig is. */
.patroon {
  position: absolute;
  inset: 0;
  background-image: var(--patroon-tegel);
  background-repeat: repeat;
  background-size: var(--tegel) var(--tegel);
}

/* Tekstblok */
.blok {
  position: absolute;
  z-index: 3;
}

.eyebrow {
  font-size: var(--grootte-eyebrow);
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--signaal);
}

h1 {
  margin-top: var(--afstand-1);
  font-size: var(--grootte-kop);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: var(--haven);
}

.lijn {
  margin-top: var(--afstand-1);
  width: var(--lijn-lengte);
  height: var(--lijn-dikte);
  background: var(--signaal);
  border-radius: 4px;
}

.sub {
  margin-top: var(--afstand-1);
  font-size: var(--grootte-sub);
  line-height: 1.5;
  color: var(--mist);
  max-width: var(--sub-breedte);
}

/* Het aanbod of de prijs, groot genoeg om te lezen */
.prijs {
  margin-top: var(--afstand-1);
  display: block;
  font-size: var(--grootte-prijs);
  font-weight: 700;
  color: var(--signaal);
}

/* De ene actie die de post vraagt */
.cta {
  margin-top: var(--afstand-2);
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: var(--cta-pad-y) var(--cta-pad-x);
  border-radius: 999px;
  background: var(--signaal);
  color: #ffffff;
  font-size: var(--grootte-cta);
  font-weight: 700;
  letter-spacing: 0.01em;
}

/* Beeldmerk */
.merk {
  position: absolute;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: var(--merk-gap);
}

.merk svg { width: var(--merk-vis); height: auto; display: block; }

.merk-tekst { display: flex; flex-direction: column; line-height: 1; }

.merk-tekst .w {
  font-size: var(--merk-w);
  font-weight: 800;
  letter-spacing: 0.015em;
  color: var(--haven);
}

.merk-tekst .a {
  margin-top: var(--merk-a-marge);
  display: flex;
  align-items: center;
  gap: var(--merk-a-gap);
  font-size: var(--merk-a);
  font-weight: 700;
  letter-spacing: 0.44em;
  color: var(--koper);
  text-indent: 0.44em;
}

.merk-tekst .a::before,
.merk-tekst .a::after {
  content: '';
  display: block;
  width: var(--merk-a-streep);
  height: var(--lijn-dikte);
  background: var(--signaal);
  border-radius: 4px;
}

/* Fotocirkel met de ring van de haven */
.foto {
  position: absolute;
  overflow: hidden;
  border-radius: 50%;
  background: #eef3f6;
  z-index: 2;
  box-shadow: 0 0 0 var(--foto-wit) #ffffff;
}

.foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ring {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

/* Lijst met prijzen */
.lijst {
  margin-top: var(--afstand-2);
  border-top: 1px solid var(--lijn);
}

.regel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  padding: var(--regel-pad) 0;
  border-bottom: 1px solid var(--lijn);
}

.regel .naam {
  font-size: var(--grootte-regel);
  font-weight: 600;
  color: var(--haven);
  line-height: 1.3;
}

.regel .prijs {
  font-size: var(--grootte-regel);
  font-weight: 700;
  color: var(--signaal);
  white-space: nowrap;
}

/* Opsomming */
.punten {
  margin-top: var(--afstand-2);
  display: flex;
  flex-direction: column;
  gap: var(--punt-gap);
}

.punt {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-size: var(--grootte-punt);
  line-height: 1.45;
  color: #dceaf2;
}

.punt::before {
  content: '';
  flex: none;
  width: 26px;
  height: 4px;
  background: var(--signaal-licht);
  border-radius: 4px;
  margin-top: 0.85em;
}

/* Voettekst */
.voet {
  position: absolute;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.voet-lijn {
  width: var(--lijn-lengte-kort);
  height: var(--lijn-dikte);
  background: var(--signaal);
  border-radius: 4px;
}

.voet .regel-plaat {
  font-size: var(--grootte-voet);
  font-weight: 700;
  color: var(--haven);
}

.voet .handle {
  font-size: var(--grootte-handle);
  font-weight: 600;
  color: var(--mist);
}

/* Tekst op donkere ondergrond */
.donker h1 { color: #ffffff; }
.donker .sub { color: #c6dbe8; }
.donker .eyebrow { color: var(--signaal-licht); }
.donker .prijs { color: var(--signaal-licht); }
.donker .voet .regel-plaat { color: #ffffff; }
.donker .voet .handle { color: #a6c0d2; }
.donker .lijn { background: var(--signaal-licht); }
.donker .cta { background: var(--signaal-licht); color: #0b2133; }

/* Het beeldmerk op een donkere of drukke ondergrond */
.merk-wit .merk-tekst .w { color: #ffffff; }
.merk-wit .merk-tekst .a { color: #f2d6b8; }
.merk-wit .merk-tekst .a::before,
.merk-wit .merk-tekst .a::after { background: var(--signaal-licht); }

/* De voettekst op een donkere ondergrond */
.voet.donker .regel-plaat { color: #ffffff; }
.voet.donker .handle { color: #a6c0d2; }
.voet.donker .voet-lijn { background: var(--signaal-licht); }

/* Volle foto met verloop */
.verloop {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to top,
    rgba(6, 26, 40, 0.95) 0%,
    rgba(6, 26, 40, 0.86) 22%,
    rgba(6, 26, 40, 0.3) 52%,
    rgba(6, 26, 40, 0.42) 100%
  );
}

.foto-vol {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.foto-vol img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Foto bovenin, tekst eronder */
.foto-boven {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
  overflow: hidden;
}

.foto-boven img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-boven::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(6, 26, 40, 0.72) 0%, rgba(6, 26, 40, 0.28) 22%, rgba(6, 26, 40, 0) 34%);
}

/* De foto aan de rechterkant: geen donkere rand bovenin nodig */
.foto-boven-rechts::before { display: none; }

.foto-boven::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--boven-verloop, linear-gradient(to top, #ffffff 4%, rgba(255, 255, 255, 0) 52%));
}

/* Donkere vlakte */
.donker-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(120% 90% at 76% 8%, #1d4a68 0%, rgba(19, 48, 72, 0) 58%),
    linear-gradient(160deg, #17415d 0%, #0b2133 100%);
}

.donker-bg .patroon { opacity: 0.14; }

/* Het patroon op een donkere vlakte krijgt een eigen tegel, want de
   kleur en de doorzichtigheid zitten in de tegel zelf. */

/* Ring op een donkere vlakte */
.ring-achter {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  border-style: solid;
  pointer-events: none;
}

/* ================================================================
   FORMAAT: VIERKANT
   ================================================================ */

.formaat-vierkant {
  --grootte-eyebrow: 19px;
  --grootte-kop: 64px;
  --grootte-sub: 28px;
  --tegel: 260px;
  --grootte-prijs: 30px;
  --grootte-cta: 25px;
  --afstand-1: 18px;
  --afstand-2: 30px;
  --sub-breedte: 600px;
  --lijn-lengte: 84px;
  --lijn-lengte-kort: 54px;
  --lijn-dikte: 6px;
  --merk-vis: 58px;
  --merk-gap: 17px;
  --merk-w: 43px;
  --merk-a: 23px;
  --merk-a-gap: 12px;
  --merk-a-streep: 30px;
  --merk-a-marge: 7px;
  --foto-wit: 13px;
  --grootte-regel: 25px;
  --regel-pad: 12px;
  --grootte-punt: 25px;
  --punt-gap: 15px;
  --grootte-voet: 25px;
  --grootte-handle: 20px;
  --cta-pad-y: 15px;
  --cta-pad-x: 30px;
}

/* ================================================================
   FORMAAT: TELEFOON
   ================================================================ */

.formaat-telefoon {
  --grootte-eyebrow: 20px;
  --grootte-kop: 70px;
  --grootte-sub: 30px;
  --tegel: 270px;
  --grootte-prijs: 32px;
  --grootte-cta: 27px;
  --afstand-1: 20px;
  --afstand-2: 34px;
  --sub-breedte: 640px;
  --lijn-lengte: 88px;
  --lijn-lengte-kort: 56px;
  --lijn-dikte: 6px;
  --merk-vis: 60px;
  --merk-gap: 18px;
  --merk-w: 45px;
  --merk-a: 24px;
  --merk-a-gap: 13px;
  --merk-a-streep: 32px;
  --merk-a-marge: 8px;
  --foto-wit: 14px;
  --grootte-regel: 26px;
  --regel-pad: 13px;
  --grootte-punt: 26px;
  --punt-gap: 16px;
  --grootte-voet: 26px;
  --grootte-handle: 21px;
  --cta-pad-y: 16px;
  --cta-pad-x: 32px;
}

/* ================================================================
   FORMAAT: DESKTOP
   ================================================================ */

.formaat-desktop {
  --grootte-eyebrow: 15px;
  --grootte-kop: 40px;
  --grootte-sub: 19px;
  --tegel: 230px;
  --grootte-prijs: 22px;
  --grootte-cta: 18px;
  --afstand-1: 12px;
  --afstand-2: 18px;
  --sub-breedte: 640px;
  --lijn-lengte: 64px;
  --lijn-lengte-kort: 42px;
  --lijn-dikte: 5px;
  --merk-vis: 44px;
  --merk-gap: 14px;
  --merk-w: 35px;
  --merk-a: 18px;
  --merk-a-gap: 9px;
  --merk-a-streep: 24px;
  --merk-a-marge: 6px;
  --foto-wit: 11px;
  --grootte-regel: 17px;
  --regel-pad: 5px;
  --grootte-punt: 19px;
  --punt-gap: 10px;
  --grootte-voet: 19px;
  --grootte-handle: 15px;
  --cta-pad-y: 11px;
  --cta-pad-x: 22px;
}
`;

/* ------------------------------------------------------------------ */
/* HTML bouwen                                                         */
/* ------------------------------------------------------------------ */

const beeldUrl = (naam) =>
  `file:///${path.join(root, 'public', 'images', naam).split(path.sep).join('/')}`;

const merkHtml = (stijl, wit = false) => `<div class="merk${wit ? ' merk-wit' : ''}" style="${stijl}">${wit ? visSvgWit : visSvg}<div class="merk-tekst"><span class="w">WESLEY'S</span><span class="a">AMBACHT</span></div></div>`;

const voetHtml = (stijl, donker = false) => `<div class="voet${donker ? ' donker' : ''}" style="${stijl}">
    <div class="voet-lijn"></div>
    <div class="regel-plaat">Wesley's Ambacht &bull; Stellendam</div>
    <div class="handle">${contact.handle} &nbsp;&bull;&nbsp; ${contact.telefoon}</div>
  </div>`;

const lijstHtml = (regels) =>
  regels
    ? `<div class="lijst">${regels
        .map(
          ([naam, prijs]) =>
            `<div class="regel"><span class="naam">${naam}</span><span class="prijs">${prijs}</span></div>`,
        )
        .join('')}</div>`
    : '';

const puntenHtml = (punten) =>
  punten
    ? `<div class="punten">${punten.map((p) => `<div class="punt">${p}</div>`).join('')}</div>`
    : '';

/** De tekst van een post, in dezelfde volgorde als op de site. */
const tekstHtml = (post) => `
  <p class="eyebrow">${post.eyebrow}</p>
  <h1>${post.titel.join('<br>')}</h1>
  <div class="lijn"></div>
  <p class="sub">${post.sub}</p>`;

/** De prijs of het aanbod, wanneer er iets te noemen valt. */
const prijsHtml = (post) => (post.prijs ? `<p class="prijs">${post.prijs}</p>` : '');

/** De ene actie die de post vraagt. */
const ctaHtml = (post) =>
  `<div class="cta">${post.cta ?? CTA}</div>`;

/**
 * De ring van de haven: een open cirkel in het signaal, met de foto
 * eronder. De opening zit rechtsonder, zoals in het ontwerp.
 */
function ringHtml(positie, draai = 0) {
  const r = 44;
  const omtrek = 2 * Math.PI * r;
  const boog = omtrek * 0.82;
  return `<svg class="ring" viewBox="0 0 100 100" style="${positie}">
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#007176" stroke-width="2.2"
      stroke-linecap="round" stroke-dasharray="${boog.toFixed(1)} ${(omtrek - boog).toFixed(1)}"
      transform="rotate(${draai} 50 50)" />
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* De opmaak per formaat                                               */
/* ------------------------------------------------------------------ */

/**
 * Per formaat de posities van het merk, de voettekst, de fotocirkel
 * en het tekstblok. Alles in pixels, want de beelden hebben een vaste
 * maat.
 */
const LAYOUT = {
  telefoon: {
    merk: 'left:60px; top:52px;',
    voet: 'left:60px; bottom:46px;',
    cirkel: {
      foto: 'width:660px; height:660px; right:-215px; bottom:-140px;',
      ring: 'width:800px; height:800px; right:-285px; bottom:-210px;',
      blok: 'left:60px; top:205px; width:680px;',
    },
    lijst: {
      foto: 'width:430px; height:430px; right:-150px; bottom:-150px;',
      ring: 'width:530px; height:530px; right:-200px; bottom:-200px;',
      blok: 'left:60px; top:178px; width:880px;',
    },
    vol: { blok: 'left:60px; bottom:235px; width:800px;' },
    boven: {
      foto: 'height:46%;',
      blok: 'left:60px; top:50%; width:820px;',
    },
    donker: { blok: 'left:60px; top:215px; width:840px;' },
  },

  vierkant: {
    merk: 'left:56px; top:48px;',
    voet: 'left:56px; bottom:40px;',
    cirkel: {
      foto: 'width:540px; height:540px; right:-170px; bottom:-170px;',
      ring: 'width:660px; height:660px; right:-230px; bottom:-230px;',
      blok: 'left:56px; top:180px; width:600px;',
    },
    lijst: {
      foto: 'width:360px; height:360px; right:-130px; bottom:-130px;',
      ring: 'width:440px; height:440px; right:-170px; bottom:-170px;',
      blok: 'left:56px; top:158px; width:840px;',
    },
    vol: { blok: 'left:56px; bottom:200px; width:760px;' },
    boven: {
      foto: 'height:43%;',
      blok: 'left:56px; top:46%; width:820px;',
    },
    donker: { blok: 'left:56px; top:185px; width:820px;' },
  },

  desktop: {
    merk: 'left:56px; top:42px;',
    voet: 'left:56px; bottom:38px;',
    cirkel: {
      foto: 'width:400px; height:400px; right:-120px; top:115px;',
      ring: 'width:490px; height:490px; right:-165px; top:70px;',
      blok: 'left:56px; top:140px; width:530px;',
    },
    lijst: {
      foto: 'width:250px; height:250px; right:-85px; top:190px;',
      ring: 'width:305px; height:305px; right:-112px; top:162px;',
      blok: 'left:56px; top:104px; width:700px;',
    },
    vol: { blok: 'left:56px; bottom:118px; width:660px;' },
    boven: {
      foto: 'height:100%; width:46%; right:0; left:auto;',
      blok: 'left:56px; top:140px; width:520px;',
      verloop: 'linear-gradient(to right, #ffffff 6%, rgba(255, 255, 255, 0) 100%)',
      donkerRand: false,
    },
    donker: { blok: 'left:56px; top:130px; width:700px;' },
  },
};

function html(post, formaat, tegels) {
  const donker = post.layout === 'donker-typografie';
  const L = LAYOUT[formaat.naam];
  const klasse = `formaat-${formaat.naam}${donker ? ' donker' : ''}`;
  const { licht: tegelLicht, donker: tegelDonker } = tegels;

  /* Bij een foto over de hele vlakte staat het merk en de voettekst op
     de foto, en moeten ze licht zijn. Op desktop staat de foto
     rechts, en blijft het merk donker. */
  const merkWit =
    post.layout === 'foto-vol' ||
    (post.layout === 'foto-boven' && formaat.naam !== 'desktop');
  const voetDonker = post.layout === 'foto-vol';

  const foto = post.foto
    ? `<img src="${beeldUrl(post.foto)}" style="object-position:${post.positie ?? 'center'}">`
    : '';

  let body = '';

  if (post.layout === 'foto-vol') {
    body = `
      <div class="foto-vol">${foto}</div>
      <div class="verloop"></div>
      <div class="blok donker" style="${L.vol.blok}">
        ${tekstHtml(post)}
        ${prijsHtml(post)}
        ${ctaHtml(post)}
      </div>`;
  } else if (post.layout === 'foto-boven') {
    body = `
      <div class="foto-boven${L.boven.donkerRand === false ? ' foto-boven-rechts' : ''}" style="${L.boven.foto}${L.boven.verloop ? `--boven-verloop:${L.boven.verloop};` : ''}">${foto}</div>
      <div class="blok" style="${L.boven.blok}">
        ${tekstHtml(post)}
        ${prijsHtml(post)}
        ${ctaHtml(post)}
      </div>`;
  } else if (post.layout === 'lijst') {
    body = `
      <div class="foto" style="${L.lijst.foto}">${foto}</div>
      ${ringHtml(L.lijst.ring, 40)}
      <div class="blok" style="${L.lijst.blok}">
        ${tekstHtml(post)}
        ${lijstHtml(post.regels)}
        ${ctaHtml(post)}
      </div>`;
  } else if (post.layout === 'donker-typografie') {
    body = `
      <div class="donker-bg"></div>
      <div class="patroon" style="--patroon-tegel:${tegelDonker}"></div>
      <div class="ring-achter" style="width:520px;height:520px;right:-180px;top:-150px;border-color:rgba(143,211,207,0.26);"></div>
      <div class="ring-achter" style="width:340px;height:340px;right:-60px;top:330px;border-color:rgba(143,211,207,0.16);"></div>
      ${merkHtml(L.merk, true)}
      <div class="blok" style="${L.donker.blok}">
        ${tekstHtml(post)}
        ${puntenHtml(post.punten)}
        ${ctaHtml(post)}
      </div>`;
  } else {
    body = `
      <div class="foto" style="${L.cirkel.foto}">${foto}</div>
      ${ringHtml(L.cirkel.ring, 40)}
      <div class="blok" style="${L.cirkel.blok}">
        ${tekstHtml(post)}
        ${prijsHtml(post)}
        ${ctaHtml(post)}
      </div>`;
  }

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap">
<style>
  :root { --patroon-tegel: ${tegelLicht}; }
  ${css}
</style>
</head>
<body class="${klasse}">
  ${post.layout === 'cirkel' || post.layout === 'lijst' ? '<div class="patroon"></div>' : ''}
  ${donker ? '' : merkHtml(L.merk, merkWit)}
  ${body}
  ${donker ? '' : voetHtml(L.voet, voetDonker)}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Renderen                                                            */
/* ------------------------------------------------------------------ */

async function scherm(uitvoer, htmlBestand, breedte, hoogte) {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${breedte},${hoogte}`,
    `--screenshot=${uitvoer}`,
    'file:///' + htmlBestand.split(path.sep).join('/'),
  ];

  // Edge slaat de screenshot op en kan daarna met een foutcode eindigen.
  // Wat telt is of het bestand er staat, dus herhaal de poging zo nodig.
  for (let poging = 1; poging <= 3; poging++) {
    try {
      await run(EDGE, args, { timeout: 60_000 });
    } catch (fout) {
      if (poging === 3) throw fout;
    }
    if (existsSync(uitvoer)) return;
  }
  throw new Error(`Screenshot mislukt: ${uitvoer}`);
}

/** De PNG's van Edge zijn groot; dit haalt er de overbodige data uit. */
async function optimaliseer(bestand) {
  const klein = await sharp(bestand).png({ compressionLevel: 9, quality: 90 }).toBuffer();
  if (klein.length < (await stat(bestand)).size) await writeFile(bestand, klein);
}

async function main() {
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });

  /* De twee tegels: het lijnwerk op wit en op de donkere vlakte. */
  const tegels = {
    licht: await patroonTegel('#dbe9f2', 1),
    donker: await patroonTegel('#cfe4ef', 0.1),
  };

  let aantal = 0;
  for (const post of POSTS) {
    for (const formaat of FORMATS) {
      const map = path.join(TMP, `${post.slug}-${formaat.naam}.html`);
      await writeFile(map, html(post, formaat, tegels), 'utf8');

      const uit = path.join(UIT, `${formaat.label}-${post.slug}-${formaat.breedte}x${formaat.hoogte}.png`);
      await mkdir(UIT, { recursive: true });
      await rm(uit, { force: true });
      await scherm(uit, map, formaat.breedte, formaat.hoogte);
      await optimaliseer(uit);
      aantal++;
      console.log(`✓ ${formaat.naam.padEnd(9)} ${post.slug} (${formaat.breedte}x${formaat.hoogte})`);
    }
  }

  /* De bijschriften erbij, zodat de beelden direct gebruikt kunnen worden. */
  const bijschriften = POSTS.map(
    (post) => `## ${post.slug}\n\n${post.caption}\n\n#wesleysambacht #stellendam #ambachtelijkecatering`,
  ).join('\n\n');
  await writeFile(path.join(root, 'social', 'CAPTIONS-V2.md'), `# Bijschriften (versie 2)\n\n${bijschriften}\n`, 'utf8');

  await rm(TMP, { recursive: true, force: true });
  console.log(`\n${aantal} afbeeldingen geschreven in social/posts-v2/`);
}

main().catch((fout) => {
  console.error(fout);
  process.exit(1);
});
