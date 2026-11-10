# Social media — Wesley's Ambacht

Tien posts, elk in drie formaten. De bestanden staan in `social/posts/`.

| Formaat | Bestandsnaam | Afmeting | Gebruik |
| --- | --- | --- | --- |
| Feed | `instagram-feed-<onderwerp>-1080x1350.png` | 1080 × 1350 | Instagram en Facebook, feed op de telefoon |
| Vierkant | `instagram-square-<onderwerp>-1080x1080.png` | 1080 × 1080 | Instagram, Facebook, LinkedIn; overal bruikbaar |
| Banner | `facebook-banner-<onderwerp>-1200x630.png` | 1200 × 630 | Link in een nieuwsbrief of bericht, X, Facebook |

De bijschriften staan in `social/CAPTIONS.md`, met hashtags per post.

## Bouwen

```bash
npm run social
```

De beelden worden opnieuw gerenderd in `social/posts/`. Er is geen extra
pakket nodig: het script bouwt een pagina in HTML en laat Microsoft Edge
die in headless mode vastleggen. Edge moet op deze computer staan; anders
zet `EDGE_PATH` naar het pad van een andere Chromium-browser.

## Wat er in elke post zit

De opzet volgt wat goed presterende cateringcampagnes doen:

1. **Het product groot in beeld.** De foto is het belangrijkste, niet de tekst.
2. **De prijs of het aanbod expliciet.** Een prijslijst, of "vanaf 10 personen".
3. **Eén duidelijke actie.** Elke post eindigt met "Vraag een offerte aan".
4. **De huisstijl van de site.** Zeeblauw, signaal-teal, het lijnwerk van de
   haven en het beeldmerk, allemaal uit `DESIGN.md`.

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
| `open-vandaag` | Openingstijden | Fotocirkel en openingstijden |
| `verse-kruiden` | Wesley en Marjoleine | Foto boven, tekst eronder |

## Aanpassen

Teksten, prijzen en beelden staan in `scripts/build-social.mjs`, in de lijst
`POSTS` bovenaan. Verandert daar een tekst, dan bouwt `npm run social` de
beelden opnieuw. Prijzen komen overeen met `src/data/site.ts`.

## Wat nog moet gebeuren

- De beelden van het terras, de barbecueplank en de haven zijn gegenereerd.
  Zodra er echte foto's zijn, verdwijnen die uit de posts.
- De rechten op de portretten van Wesley en Marjoleine zijn nog niet bevestigd.
  Tot dat zwart-op-wit is, lopen `verse-broodjes`, `verse-kruiden` en
  `ambachtelijke-worst` het risico om niet te mogen plaatsen.
