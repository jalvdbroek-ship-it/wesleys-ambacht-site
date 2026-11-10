# Wesley's Ambacht — website

De website van Wesley's Ambacht: de Ambachtswinkel aan de buitenhaven van Stellendam,
ambachtelijke catering op locatie en een vergaderruimte met uitzicht over de haven.

Astro 5 + Tailwind v4, volledig statisch. De stijlrichting heet **Havenlicht** en
staat in `DESIGN.md`.

## De live site

**https://jalvdbroek-ship-it.github.io/wesleys-ambacht-site/**

Deze link blijft staan. Elke push naar `main` zet de site opnieuw live via
GitHub Pages (`.github/workflows/pages.yml`). Je hoeft geen tunnel meer te
starten en de link verdwijnt niet meer.

| Route | Pagina |
| --- | --- |
| `/` | Home |
| `/ambachtswinkel/` | De Ambachtswinkel |
| `/catering/` | Catering |
| `/vergaderen/` | Vergaderen |
| `/contact/` | Contact en offerte |
| `/404.html` | Pagina niet gevonden |

Het eigen domein `ambachtbijwesley.nl` wijst nu nog naar de oude site op
Netlify. Zodra die is omgezet komt de `site` in `astro.config.mjs` weer op
het domein te staan en verdwijnt het basispad van de deployment.

## Starten

```bash
npm install
npm run dev
```

De site draait dan op http://localhost:4321.

### Bouwen met een basispad

Op GitHub Pages staat de site in `/wesleys-ambacht-site`, op het eigen domein
in `/`. Daarom leest `astro.config.mjs` de waarden uit de omgeving:

```bash
DEPLOY_BASE=wesleys-ambacht-site SITE_URL=https://jalvdbroek-ship-it.github.io/wesleys-ambacht-site npm run build
```

Alle interne links en afbeeldingen lopen via `src/lib/urls.ts`, dat het
basispad ervoor zet. Vergeet die helper niet bij nieuwe pagina's: zonder
`withBase` wijst een link naar `/contact` buiten het pad van de deployment.

### De site online zetten

De repository is openbaar en de Pages-build staat aan. Pushen naar `main`
is genoeg:

```bash
git push origin main
```

De build is daarna te volgen onder Actions in de repository. De interne
overdrachtsdocumenten in `handover/` staan bewust buiten de repository:
die horen bij het interne overdrachtsproces, niet bij een openbare site.

## Scripts

| Script | Wat het doet |
| --- | --- |
| `npm run dev` | Ontwikkelserver |
| `npm run build` | Productiebuild in `dist/` |
| `npm run preview` | Draait de productiebuild lokaal, bereikbaar voor een tunnel |
| `npm run delen` | Maakt een openbare link naar de lokale site |
| `npm run check` | TypeScript-controle van Astro en de componenten |
| `npm run contrast` | Meet het contrast van elk kleurpaar in het palet |
| `npm run verify:ui` | Browsercontrole op focus, menu, FAQ, reduced motion en inhoud |
| `npm run check:overflow` | Controleert alle pagina's op horizontale overloop |
| `npm run shots` | Maakt screenshots van alle pagina's op desktop en mobiel |
| `npm run social` | Bouwt de social media-beelden in drie formaten, zie `social/` |
| `npm run social:v2` | Bouwt versie 2 van de social media-beelden, zonder de horizontale strepen |
| `npm run merk:snijden` | Snijdt het beeldmerk uit zijn marge, met transparante achtergrond |
| `npm run handover` | Bouwt het overdrachtsdocument in `handover/` |
| `npm run handover:push` | Stuurt de overdracht naar Notion, Linear en Slack |
| `npm run slack:msg` | Schrijft het Slack-bericht voor `#webrnds` |

`npm run contrast` en `npm run verify:ui` horen groen te zijn voordat je live gaat.
De tweede heeft de site nodig op poort 4321 (`npm run preview`).

De social media-beelden staan in `social/`: tien posts in drie
formaten, met bijschriften. Versie 2 in `social/posts-v2/` is de
schoone, zonder de horizontale strepen. Zie `social/README.md`.

## Overdracht naar Notion, Linear en Slack

Er zijn twee overdrachten. De eerste is de uitleg, de tweede is de website zelf.

**1. De overdracht (uitleg)** staat in `handover/`. Alles wordt gelezen uit
`src/data/site.ts`, dus het document en de site kunnen niet uit elkaar lopen.

| Dienst | Bestemming |
| --- | --- |
| Notion | Kindpagina onder de klantplek "Wesleys Ambacht" in de database Klanten |
| Linear | Issue in team WEB, project "Wesleys Ambacht - Klant", met sub-issues per taak |
| Slack | Bericht in `#webrnds` in de WEBRNDS-workspace |

**2. De website in HTML** staat in `handover/site/`. Zes zelfstandige
HTML-bestanden met de CSS inline, plus `index-overzicht.html` dat ze aan elkaar
koppelt. `handover/wesleys-ambacht-website.zip` bevat de hele site in twee
vormen: `website/` met de kant-en-klare HTML plus de media, en `bron/` met de
volledige broncode. Uitpakken en `website/index.html` openen werkt meteen;
in `bron/` draait `npm install && npm run build`.

| Dienst | Bestemming |
| --- | --- |
| Notion | Kindpagina "de website in HTML", met per pagina een kindpagina met de volledige HTML |
| Linear | Comments op WEB-49, per pagina de volledige HTML in een codeblok |
| Slack | Het zipbestand als upload, plus een bericht met de links |

De tokens komen uit `handover/.env` (staat in `.gitignore`):

```
NOTION_TOKEN=ntn_...
LINEAR_API_KEY=lin_api_...
SLACK_BOT_TOKEN=xoxb-...
```

Zonder een token slaat die dienst over en meldt dat. De Linear-sleutel en de
Notion-token worden ook uit de bestaande lokale omgeving gelezen als ze er zijn,
dus voor Notion en Linear is vaak niets nodig.

**Scripts**

| Script | Wat het doet |
| --- | --- |
| `npm run handover` | Bouwt het overdrachtsdocument in `handover/` |
| `npm run handover:push` | Stuurt de overdracht naar Notion, Linear en Slack |
| `npm run site:html` | Bouwt de zelfstandige HTML-bestanden in `handover/site/` |
| `npm run site:push` | Stuurt de HTML van de website naar Notion, Linear en Slack |
| `npm run site:zip` | Pakt de website in een zip |
| `npm run slack:msg` | Schrijft het Slack-bericht voor `#webrnds` |
| `npm run check:html` | Controleert de zelfstandige HTML-bestanden |
| `npm run check:pakket` | Controleert het uitgepakte pakket |

## Structuur

```
src/
  data/site.ts        alle inhoud: teksten, prijzen, producten, openingstijden
  layouts/BaseLayout  head, metadaten, structured data, header en footer
  lib/urls.ts          zet het basispad voor alle interne links en afbeeldingen
  components/         header, footer, held, formulier, menukaart, sectiekop,
                      faq, cta, fotoband en de mobiele actiebalk
  pages/              index, ambachtswinkel, catering, vergaderen, contact, 404
  styles/global.css   de tokens en de componentklassen
  scripts/motion.ts   accentlijn en compacte kop, met terugval als JavaScript uit staat
scripts/
  contrast.ts         contrastmeting op WCAG 2.2 AA
  verify-ui.mts       browsercontrole op toegankelijkheid en inhoud
  check-overflow.mjs  controleert alle pagina's op horizontale overloop
  shots.mjs           maakt screenshots van alle pagina's
  build-handover.mjs  bouwt het overdrachtsdocument
  push-handover.mjs   stuurt de overdracht naar Notion, Linear en Slack
  slack-msg.mjs       schrijft het Slack-bericht
  build-social.mjs    bouwt de social media-beelden (versie 1)
  build-social-v2.mjs bouwt de social media-beelden (versie 2, zonder strepen)
public/
  images/             foto's van de winkel, het team en de producten
  images/patroon-haven.png   de tegel van het achtergrondpatroon
  brochures/          de prijslijsten van Wesley's Ambacht
social/
  posts/              de social media-beelden in drie formaten (versie 1)
  posts-v2/           versie 2: hetzelfde, maar zonder de horizontale strepen
  CAPTIONS.md         de bijschriften per post
  CAPTIONS-V2.md      dezelfde bijschriften voor versie 2
  README.md           wat er in elke post zit
handover/
  wesleys-ambacht-handover.html   het overdrachtsdocument
  wesleys-ambacht-website.zip      de hele site: HTML plus broncode
  site/               de zelfstandige HTML-bestanden
  notion.md, linear-issue.md, slack-bericht.txt   de brondocumenten
  config.json                    de bestemmingen
```

## Belangrijk bij het uitbreiden

1. **Teksten en prijzen staan in `src/data/site.ts`.** Verander niets in de pagina's
   als het om tekst of prijzen gaat, anders wordt de volgende update lastig.
2. **Kleuren staan in `src/styles/global.css`**, in OKLCH. Na elke kleurwijziging
   `npm run contrast` draaien: het script faalt als een paar onder de norm komt.
3. **Eén content rail.** De `.rail`-klasse bepaalt de marge en wordt overal hergebruikt.
4. **Prijzen zijn inclusief btw.** De meeste prijzen gelden per persoon.
5. **De sluitmelding** in `src/data/site.ts` staat bovenaan iedere pagina. Zet hem
   uit of pas de data aan zodra de winkel weer open is.

## Nog te doen voor livegang

- [ ] De AI-beelden vervangen door echte foto's (zie hieronder).
- [ ] De Kerstbrochure toevoegen zodra die voor dit seizoen klaar is.
- [ ] Openingstijden controleren: nu hebben de winkel en de catering dezelfde.
- [ ] Het contactformulier koppelen aan een mailbox of formulierdienst. Het formulier
      is nu een demonstratie: het verzendt en opslaat niets.
- [ ] Een privacyverklaring en algemene voorwaarden toevoegen. De huidige site heeft
      `/privacy` en `/voorwaarden.html`; die inhoud is niet overgenomen.
- [ ] De advertentie- en actiesectie uit de oude site overnemen als die weer actueel is.
- [ ] Rechten op de foto's van Wesley en Marjoleine bevestigen, en de huisstijl
      definitief maken. Beide lopen in Linear onder WEB-39.
- [ ] De SEO-migratie en redirects vanaf het huidige domein voeren.
- [ ] `ambachtbijwesley.nl` omzetten naar deze build. Zolang dat niet is gedaan
      serveert het domein nog de oude site op Netlify.
- [ ] `astro.config.mjs` controleren: de `site` staat op `https://ambachtbijwesley.nl`.
      Op de Pages-build wordt dat overschreven door `SITE_URL`.

## Over de beelden

De site gebruikt twee soorten foto's:

**Echte foto's van Wesley's Ambacht** (van de huidige site): `hero.jpg`,
`Wesley-bar.jpeg`, `Marjoleine.jpg`, `wesley-marjoleine-werken.jpeg`,
`Wesley-BBQ-op-locatie.jpeg`, `gerookte-paling.jpeg`, `ambachtelijke-buffetten.jpeg`
en de drie Instagram-foto's. Dit zijn de mensen, het werk en de producten zelf.

**Beeldmateriaal uit de map `Downloads/ambacht`**: de havenscènes bij zonsondergang,
het terras en de barbecueplank. Deze zijn gegenereerd en geven de sfeer van de haven
weer, maar ze zijn geen foto's van de werkelijke locatie of producten. Vervang ze
door echte foto's van het terras, de haven en de gerechten zodra die er zijn.

De `favicon.png` en `apple-touch-icon.png` zijn uit het bestaande logo gesneden.
De `linkkaart.png` is de afbeelding voor socials en is bewust gemaakt zonder
klantfoto's, zolang de rechten op portretten niet bevestigd zijn.
