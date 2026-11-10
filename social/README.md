# Social media — Wesley's Ambacht

Tien posts, elk in drie formaten. Er staan twee versies:

| Map | Versie | Wat het is |
| --- | --- | --- |
| `social/posts/` | 1 | de eerste serie |
| `social/posts-v2/` | 2 | **de serie om te gebruiken**: schoon patroon, zonder horizontale strepen |

De bijschriften staan in `social/CAPTIONS.md` (versie 1) en
`social/CAPTIONS-V2.md` (versie 2), met hashtags per post.

## De formaten

| Formaat | Bestandsnaam | Afmeting | Gebruik |
| --- | --- | --- | --- |
| Feed | `instagram-feed-<onderwerp>-1080x1350.png` | 1080 × 1350 | Instagram en Facebook, feed op de telefoon |
| Vierkant | `instagram-square-<onderwerp>-1080x1080.png` | 1080 × 1080 | Instagram, Facebook, LinkedIn; overal bruikbaar |
| Banner | `facebook-banner-<onderwerp>-1200x630.png` | 1200 × 630 | Link in een nieuwsbrief of bericht, X, Facebook |

## Bouwen

```bash
npm run social      # versie 1, in social/posts/
npm run social:v2   # versie 2, in social/posts-v2/
```

De beelden worden opnieuw gerenderd. Er is geen extra pakket nodig: het
script bouwt een pagina in HTML en laat Microsoft Edge die in headless mode
vastleggen. Edge moet op deze computer staan; anders zet `EDGE_PATH` naar
het pad van een andere Chromium-browser.

## Wat er in elke post zit

De opzet volgt wat goed presterende cateringcampagnes doen:

1. **Het product groot in beeld.** De foto is het belangrijkste, niet de tekst.
2. **De prijs of het aanbod expliciet.** Een prijslijst, of "vanaf 10 personen".
3. **Eén duidelijke actie.** Elke post eindigt met "Vraag een offerte aan".
4. **De huisstijl van de site.** Zeeblauw, signaal-teal, het lijnwerk van de
   haven en het beeldmerk, allemaal uit `DESIGN.md`.

## Het verschil tussen versie 1 en 2

Het achtergrondpatroon was in versie 1 een CSS-mask met een SVG-tegel. Op elke
tegelgrens tekende de browser daarbij een haarlijn, waardoor er horizontale
strepen over de achtergrond liepen. In versie 2 is het patroon een vooraf
gerasterde tegel (`public/images/patroon-haven.png`): geen mask, geen
schaalverschil, dus geen naden. De site zelf (`src/styles/global.css`) gebruikt
dezelfde tegel.

De opmaak is verder hetzelfde, alleen rustiger: een grotere tegel, zodat het
lijnwerk niet over de tekst loopt.

## De posts

| Onderwerp | Wat het is | Opbouw |
| --- | --- | --- |
| `vuur-en-vis` | Verse vis en vlees van het vuur | Foto over de hele vlakte |
| `zelf-gerookt` | Eigen rookoven | Fotocirkel met de ring |
| `bbq-op-locatie` | BBQ op locatie | Fotocirkel met de ring |
| `verse-broodjes` | Verse broodjes | Foto boven, tekst eronder |
| `ambachtelijke-worst` | Eigen worst | Foto over de hele vlakte |
| `borrelplanken` | Borrelplanken met prijzen | Fotocirkel en prijslijst |
| `buffetten` | Buffetten met prijzen | Fotocirkel en prijslijst |
| `vergaderen` | Vergaderruimte | Donkere vlakte met opsomming |
| `open-vandaag` | Openingstijden | Fotocircel en openingstijden |
| `verse-kruiden` | Wesley en Marjoleine | Foto boven, tekst eronder |

## Aanpassen

Teksten, prijzen en beelden staan in `scripts/build-social.mjs` en
`scripts/build-social-v2.mjs`, in de lijst `POSTS` bovenaan. Verandert daar
een tekst, dan bouwt het script de beelden opnieuw. Prijzen komen overeen met
`src/data/site.ts`.

## Wat nog moet gebeuren

- De beelden van het terras, de barbecueplank en de haven zijn gegenereerd.
  Zodra er echte foto's zijn, verdwijnen die uit de posts.
- De rechten op de portretten van Wesley en Marjoleine zijn nog niet bevestigd.
  Tot dat zwart-op-wit is, lopen `verse-broodjes`, `verse-kruiden` en
  `ambachtelijke-worst` het risico om niet te mogen plaatsen.
