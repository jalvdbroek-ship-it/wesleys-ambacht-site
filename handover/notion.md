# Wesley's Ambacht — website-overdracht

De nieuwe website van Wesley's Ambacht staat. De website is af en gebouwd, alle prijzen, producten en teksten komen uit de oude site en de brochure-PDF’s. Dit document is de overdracht: wat er staat, hoe het in elkaar zit en wat er nog openstaat.

## Kerngegevens

- **Klant:** Wesley's Ambacht
- **Adres:** Meester Snijderweg 5 (voorzijde), 3251 LJ Stellendam
- **Telefoon:** +31 6 39 58 11 28
- **E-mail:** info@ambachtswinkel.nl
- **Openingstijden:** Dinsdag t/m vrijdag 10:00 tot 18:00, Zaterdag 10:00 tot 18:00, Zondag en maandag Gesloten
- **Stack:** Astro 5, Tailwind v4, TypeScript strict. Volledig statisch.

## Wat er staat

| Pagina | Wat erop staat |
| --- | --- |
| Home | De belofte, de drie banen, de kaart, het team, de reviews |
| Ambachtswinkel | Het concept, de lokale samenwerkingen, bezoek en vragen |
| Catering | Alle diensten, vleespakketten, buffetten, salades, borrelplanken, kosten |
| Vergaderen | De ruimte, de arrangementen, de buitenhaven |
| Contact | Offerteaanvraag, contactgegevens, het vervolg |

## Het merk

De richting heet **Havenlicht**: licht en helder, zoals een etalage aan de buitenhaven op een zomerse dag. Zeeblauw als inkt, een teal dat aan het signaal van de haven doet denken, en het lijnwerk van golf, vis, scheepsrad en anker als sfeer. Het bestaande handgetekende logo is het beeldmerk gebleven.

### Kleuren

| Rol | Waarde | Gebruik |
| --- | --- | --- |
| haven | `oklch(0.3 0.055 245)` | diep zeeblauw: koppen, donkere band, knoppen |
| haven-donker | `oklch(0.21 0.045 250)` | voetstuk |
| haven-mist | `oklch(0.955 0.014 225)` | koel paneel, avondlicht |
| ink | `oklch(0.3 0.05 245)` | bodytekst |
| ink-mist | `oklch(0.52 0.03 240)` | inleidingen, bijschriften en metadata |
| signaal | `oklch(0.5 0.085 200)` | haven-teal: prijzen, accent, links |
| signaal-donker | `oklch(0.42 0.08 202)` | hover op het signaal |
| signaal-licht | `oklch(0.78 0.075 195)` | signaal op een donkere vlakte |
| wit-mist | `oklch(0.92 0.012 230)` | tekst op zeeblauw |
| schuim | `oklch(0.968 0.009 225)` | lichte sectieband |
| lijn | `oklch(0.895 0.012 235)` | haarlijn tussen kaarten |
| lijn-invoer | `oklch(0.62 0.022 235)` | rand van een veld, 3:1 tegen wit |
| vuurtoren | `oklch(0.62 0.13 65)` | het licht van de vuurtoren: sterren |

### Typografie

- **Figtree** voor alles: een afgerond geometrisch sans die warmte en zakelijkheid combineert. Gewicht 400 voor body, 600 voor labels, 700 voor koppen, 800 voor de grote regel in de held.
- De body is 1,0625rem, iets groter dan de standaard, omdat de meeste bezoekers ouder zijn en op een telefoon lezen. De prijzen staan in het signaal, met tabulaire cijfers.

### Eigen elementen

- **De ring van de haven.** Eén cirkel in het signaal: als ring om de foto in de held, als cirkelvormige foto bij de drie manieren om ons te vinden, en als grote cirkel die uit de hoek van de voetstuk loopt.
- **Het lijnwerk van de haven.** Golf, vis, scheepsrad en anker als mask op acht procent, alleen in de held.
- **De menukaart.** De prijslijsten zijn geen tabellen maar witte kaarten met een hairline rand, de titel in zeeblauw en de prijs in het signaal.

### Beweging

Er is geen beweging die opvalt. Het scroll-reveal markeert alleen dat een blok in beeld is. Met prefers-reduced-motion gebeurt er niets, en zonder JavaScript staat alle tekst gewoon zichtbaar.

## Producten en prijzen

Alle prijzen zijn inclusief btw. De meeste gelden per persoon.

### Vleespakketten

| Product | Omschrijving | Prijs |
| --- | --- | --- |
| Vleespakket basis | Vijf soorten vlees voor de barbecue, voor iedereen. Kipsaté, Kip shaslick, Classic hamburger, BBQ worst, Speklap gemarineerd. | € 9,95 p.p. |
| Vleespakket luxe | Uit te breiden met een chef op locatie. Maximaal vijf personen. Kipsaté, Varkenshaasspies, Black Angus burger, BBQ worst met jalapeño en cheddar, Spareribs in BBQ-saus, Procureurlap, Zalm in hollandaise, Gambaspies, Biefstukspies. | € 13,95 p.p. |

### Buffetten

| Product | Omschrijving | Prijs |
| --- | --- | --- |
| Stamppotbuffet basis | Andijvie, boerenkool of hutspot. Eigen gehaktbal, huisgerookte worst en speklapje. | € 17,00 p.p. |
| Stamppotbuffet luxe | Met soep vooraf: erwtensoep, witlofsoep of tomatensoep. | € 22,50 p.p. |
| Warm buffet | Vier keuzes uit vlees en vis, vier salades, brood en smeersels, fruitsalade en sauzen. | € 24,00 p.p. |
| BBQ buffet basis | Maximaal vijf hapjes per gast. Kok inbegrepen, op basis van nacalculatie. | € 19,00 p.p. |
| BBQ buffet luxe | Black Angus burger, biefstukspies, sparerib, zalm met hollandaise en meer. | € 23,50 p.p. |

### Salades

| Product | Omschrijving | Prijs |
| --- | --- | --- |
| Pastasalade pesto | Vegetarisch. | € 8,50 |
| Carpaccio salade | Rijk gevuld. | € 10,95 |
| Rijke vleessalade | Met ambachtelijk vlees. | € 14,50 |
| Rijke vissalade | Verse vis, rijk gevuld. | € 17,50 |

### Borrelplanken

| Product | Omschrijving | Prijs |
| --- | --- | --- |
| Grillworst, charcuterie, kaas | De basis. Vanaf 10 personen, een dag van tevoren bestellen. | € 6,50 p.p. |
| Grillworst, charcuterie, kaas en worstenbroodje | Met een worstenbroodje erbij. | € 8,50 p.p. |
| Speksoorten, charcuterie, kaas | Uit eigen ambachtelijke worst. | € 10,00 p.p. |
| Speksoorten, charcuterie, kaas en gerookte zalm | Met gerookte zalm van eigen huis. | € 12,50 p.p. |
| Speksoorten, charcuterie, kaas, gerookte paling en olijven | De meest complete plank. | € 15,00 p.p. |

### Broodjeslunch

Huisgemaakte belegde broodjes met het brood van Bakkerij van Harberden in Melissant. Voor lunch en events.

Belegging: Gerookte zalm, Huisgerookte palingfilet, Pulled pork, Kip shaslick, Ambachtelijke grillworst.

### Koffie

Volautomatisch koffiezetapparaat voor je feest of partij, met bonen van Roger’s Coffee service. Slow roast, diverse melanges. Vanaf vanaf € 50 per dag.

### Vergaderarrangementen

| Arrangement | Omschrijving | Prijs |
| --- | --- | --- |
| Huur vergaderruimte | Volledig ingericht met flipover, whiteboard en op aanvraag een beamer. | € 120 per dagdeel |
| Koffie-arrangement | Onbeperkt koffie, thee, water en koekjes. | € 11,50 p.p. |
| Uitgebreid arrangement | Onbeperkt koffie, thee, water, koekjes, gebak en frisdrank. | € 16,50 p.p. |
| Fruitmand | Verse fruit in de vergaderruimte. | € 2,50 p.p. |
| Lunchbuffet basis | Broodje kaas, boerenham of salami, filet american, zalm of krabsalade, eiersalade. | € 15,50 p.p. |
| Lunchbuffet luxe | Broodje grillworst, huisgerookte zalm, palingfilet, makreelrilette, tonijnsalade, eiersalade, carpaccio. | € 21,50 p.p. |
| Bittergarnituur | Een borrelplank met onze ambachtelijke producten. | € 11,50 p.p. |
| Plateau gebakken vis | Gebakken vis met bijbehorende sauzen. | € 14,50 p.p. |
| Borrelplank ambachtelijk | Rijk gevulde borrelplank met grillworst, speksoorten, gerookte zalm, charcuterie en kaas. | € 18,50 p.p. |

### Kosten die apart worden berekend

- **kokPerUur**: € 57,50 per uur inclusief btw
- **schoonmaak**: € 25,00 inclusief btw
- **borden**: € 5,00 per 10 inclusief schoonmaakkosten
- **bestek**: € 2,50 per 10 inclusief schoonmaakkosten
- **buffettafel**: € 15,00 per buffettafel

## Het team

Geen poespas, wél eerlijk: gegrild en gerookt vlees en vis, zonder E-nummers, met verse kruiden uit de eigen tuin.

- **Wesley, Meester van het vuur.** Wesley staat achter de grill en de rookoven. Hij bepaalt het vuur, de temperatuur en het moment waarop het vlees klaar is.
- **Marjoleine, Kruidenliefhebber.** Marjoleine stuurt de smaken aan met verse kruiden uit de eigen tuin. Zij maakt de gerechten af en houdt de presentatie bij.

## Reviews

- *“Afgelopen weekend een catering bij Wesley laten bezorgen, top kwaliteit eten goed verzorgd en meer dan voldoende als je per persoon bestelt.”** — Piet Kagchelland, 29 december 2024
- *“Wat je hier ook haalt, het is een feestje. Je proeft de liefde en ambacht. Heerlijk eten en uitstekende waarde.”** — Sarah Kampman, 10 maart 2024
- *“Helemaal top! Zowel de koudgerookte zalm als de grillworst (naturel) smaakten meer dan prima. Dikke aanrader.”** — Marleen Vlaspoel, 7 mei 2023
- *“Heerlijke, eerlijke producten zonder toevoegingen en E-nummers.”** — Hans Grinwis, 31 maart 2023

## Nog openstaan

### Taken

- [ ] **AI-beelden vervangen door echte foto’s**
	De havenscènes, het terras en de barbecueplank komen uit de map Downloads/ambacht en zijn gegenereerd. Ze geven de sfeer weer, maar het zijn geen foto’s van de werkelijke locatie of producten.
- [ ] **Rechten op foto’s en portretten bevestigen**
	De site gebruikt foto’s van Wesley en Marjoleine en van de producten, overgenomen van de huidige site. Rechten op portretten zijn nog niet bevestigd. De linkkaart is daarom al een eigen beeld zonder klantfoto’s.
- [ ] **Huisstijl en fontlicentie bevestigen**
	De site gebruikt Figtree, van Google Fonts en gratis in licentie. Bevestig of dit de definitieve huisstijl is.
- [ ] **Kerstbrochure toevoegen**
	De brochure uit 2025 is bewust niet meverhuurd. Voeg de nieuwe versie toe in public/brochures en zet de link in src/pages/catering.astro.
- [ ] **Openingstijden en vakantieperiode controleren**
	De site toont de sluiting van 26 oktober tot en met 8 november. De winkel en de catering hebben nu dezelfde openingstijden; controleer of dat klopt.
- [ ] **Formulierontvangst, privacytekst en voorwaarden**
	Het formulier is een demonstratie: het verzendt en opslaat niets en laat alleen zien wat eruit zou gaan. Een mailbox, een formulierprovider en een privacytekst moeten nog worden ingericht en getest.
- [ ] **Advertentie- en actiesectie**
	De huidige site heeft een sectie met acties en specials die automatisch verlopen. Die is niet overgenomen.
- [ ] **Domein en SEO-migratie**
	De site staat nu op ambachtbijwesley.nl. Controleer of dat het domein wordt waar de site live komt, en of er een migratie vanaf het huidige dome nodig is.

### Vragen aan de klant

- Krijgt de Ambachtswinkel een eigen openingstijd of dezelfde als de catering?
- Wordt de vergaderruimte ook via de website boekbaar, of blijft dat telefonisch?
- Is er een fotograaf die een dag lang de winkel, het team en de producten vastlegt?
- Welke beelden mogen van Instagram worden gebruikt, en moeten die altijd hetzelfde blijven?
- Komt er een aparte pagina voor de workshops of kookavonden?
- Moeten de Kerst- of themabundels per seizoen op een aparte pagina komen?

## Techniek

```
src/
  data/site.ts        alle inhoud: teksten, prijzen, producten, openingstijden
  layouts/            head, metadaten, structured data, header en footer
  components/         header, footer, formulier, menukaart, sectiekop, faq
  pages/              index, ambachtswinkel, catering, vergaderen, contact, 404
  styles/global.css   de tokens en de componentklassen
scripts/
  contrast.ts         contrastmeting op WCAG 2.2 AA
  verify-ui.mts       browsercontrole op toegankelijkheid en inhoud
  build-handover.mjs  bouwt dit document
```

### Checks

- `npm run build` slaagt
- `npm run check` is schoon
- `npm run contrast`: 23 paren, allemaal WCAG 2.2 AA
- `npm run verify:ui`: focus, mobiel menu, FAQ, content rail, reduced motion, geen emoji of em dash

### Belangrijk bij het uitbreiden

1. Teksten en prijzen staan in `src/data/site.ts`. Verander niets in de pagina’s als het om tekst of prijzen gaat.
2. Kleuren staan in `src/styles/global.css`, in OKLCH. Draai daarna `npm run contrast`.
3. Nieuwe prijzen horen in een `Menukaart`, niet in een losse kaart.
4. Er is geen zoekfunctie, geen filter en geen winkelmand. De site is een etalage, geen winkel.
