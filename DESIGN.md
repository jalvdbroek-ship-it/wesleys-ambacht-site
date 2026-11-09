# DESIGN — Wesley's Ambacht

Ontwerpbesluiten voor de website van Wesley's Ambacht. Het publiek is de site
zelf: op de homepage staat meteen wat je krijgt, wat het kost en waar je moet zijn.

## Richting: Havenlicht

De site is licht en helder, zoals een etalage aan de buitenhaven op een zomerse
dag. Wit papier, zeeblauw als inkt, en een teal dat aan het signaal van de haven
doet denken. De vormtaal komt van cateringcentrale.nl: een held met een foto in
een cirkel, pillvormige knoppen, productkaarten met een ronde foto, een donkere
blok met het verhaal, en klantkaarten in een rij. Wat daar algemeen is, wordt hier
van de haven van Stellendam: het lijnwerk van golf, vis, scheepsrad en anker in
de achtergrond, de ring om de foto's en het zeeblauw van het huismerk.

Het handgetekende beeldmerk van Wesley en Marjoleine blijft het gezicht van het
merk. Het koper uit het logo is het enige warme dat nog overblijft, en het zit in
het beeldmerk zelf.

## Kleur

Rollen in OKLCH, gemeten met `npm run contrast`:

| Rol | Waarde | Gebruik |
| --- | --- | --- |
| Haven | `oklch(0.3 0.055 245)` | Koppen, de donkere band, de hoofdknop |
| Haven donker | `oklch(0.21 0.045 250)` | Hover op de hoofdknop |
| Inkt | `oklch(0.3 0.05 245)` | Bodytekst |
| Inkt mist | `oklch(0.52 0.03 240)` | Inleidingen, bijschriften, metadata |
| Signaal | `oklch(0.5 0.085 200)` | Prijzen, eyebrow-labels, links, het belknopje |
| Signaal donker | `oklch(0.42 0.08 202)` | Hover op het signaal |
| Signaal licht | `oklch(0.78 0.075 195)` | Signaal op een donkere vlakte |
| Schuim | `oklch(0.968 0.009 225)` | De lichte sectieband |
| Lijn | `oklch(0.895 0.012 235)` | Haarlijn tussen kaarten |
| Lijn invoer | `oklch(0.62 0.022 235)` | Rand van een veld, 3:1 tegen wit |
| Vuurtoren | `oklch(0.62 0.13 65)` | De sterren bij een review, verder nergens |

Er zijn twee tekstniveaus, geen drie: bijschrift en inleiding delen dezelfde
kleur, omdat een derde, lichtere niveau de AA-norm op de lichte sectieband niet
haalt.

Alle contrastparen staan in `scripts/contrast.ts` en worden gemeten met
`npm run contrast`. Ze halen WCAG 2.2 AA: 4,5:1 voor tekst, 3:1 voor randen,
ringen en sterretjes. Er is geen donkere modus: de site is een etalage, geen
avondtent.

## Typografie

Eén familie: **Figtree**, een afgerond geometrisch sans die warmte en zakelijkheid
combineert. Dezelfde aanpak als de referentie, maar niet dezelfde letter. Figtree
heeft zachte hoeken en een open `g`, en blijft leesbaar op een telefoon.

Gewichten: 400 voor body, 600 voor labels en menu, 700 voor koppen, 800 voor de
grote regel in de held. De schaal loopt van 0,8125rem (utility) tot
`clamp(2.5rem, 4.2vw, 3.25rem)` voor de grote regel in de held. De body is
1,0625rem, iets groter dan de 16px-standaard, omdat de meeste bezoekers ouder
zijn en op een telefoon lezen.

## Vorm en materiaal

Vlak met haarlijnen. Kaarten zijn wit met een hairline rand en een radius van
20px, zoals bij cateringcentrale.nl. Er is één schaduwtrap, die alleen op de
menukaarten staat, omdat die los van de achtergrond moeten zweven. Knoppen zijn
pills: dat is een bewust motief, geen default. De enige andere cirkel is het
beeldmerk zelf en de ring van de haven.

## Eigen elementen

Drie tekens, allemaal uit het werk zelf:

1. **De ring van de haven.** Eén cirkel in het signaal: als ring om de foto in de
   held, als cirkelvormige foto bij de drie manieren om ons te vinden, en als
   grote cirkel die uit de hoek van de voetstuk loopt.
2. **Het lijnwerk van de haven.** Golf, vis, scheepsrad en anker als mask op
   zeven procent, alleen in de held. Op een telefoon vijf procent, want daar
   ligt het dichter bij de tekst.
3. **Het roosterpatroon.** Twee families diagonale lijnen, als het ijzeren
   rooster boven het vuur. Het staat op de barbecue-sectie van de cateringspagina
   op negen procent, met een mask die het in het midden laat verdwijnen zodat de
   tekst leesbaar blijft.

Daarnaast twee warmtes: de gloed over de barbecue-foto in de held van de
cateringspagina, en de golven onder de held.

## De menukaart

De prijslijsten blijven menukaarten: naam, prijs, wat erin zit. Wit papier met
een haarlijn, de titel in zeeblauw, de prijs in het signaal en de onderdelen als
kleine pillen. Geen dubbele rand meer en geen tafellijn.

De vleespakketten hebben geen menukaart maar twee kaarten naast elkaar, met de
soorten vlees als pillen. De prijs staat daar groot in het signaal, want dat is
het getal dat mensen vergelijken.

## Beeld

Foto's van het werk, van de mensen en van de plek. De held en de kaarten op de
homepage gebruiken een cirkelvormige bijsnede, net als de productkaarten van de
referentie. De overige beelden staan in een afgerond rechthoek. De
linkkaart blijft zonder klantfoto's.

Zolang er geen echte foto's van het terras zijn, komt de sfeer uit het
beeldmateriaal in `Downloads/ambacht`. Die beelden zijn gegenereerd. Ze staan
nergens als bewijs van een concreet product of een concrete locatie, alleen als
sfeer. Zie de README voor de lijst.

## Beweging

Er is één georkestreeerd moment: de held. De kop en de tekst komen 12 pixels omhoog
in 460ms, gestaffeld over 190ms. Alleen een beweging, geen vloei, zodat de tekst
altijd leesbaar blijft, ook als een programma de animaties uitzet.

Daarnaast zijn er drie rustige momenten en wat feedback op hover:

1. **De ring van de haven tekent zich.** Bij het openen loopt de ring om de foto
   in 1,1 seconde rond, tegen de klok in. De foto komt eronder te staan, zodat
   alleen het deel linksboven zichtbaar blijft. Het is een cirkel in het signaal
   met een `stroke-dasharray`, geen plaatje.
2. **De waterlijn.** Onder de held loopt een golfslag in het signaal langzaam
   naar links, als een getij. De twee golven lopen niet gelijk: de brede voorste
   lijn doet 27 seconden over een rondje, de fijnere achterste 9 seconden. Dat
   verschil geeft het water diepte, waar twee gelijke golven plat overkomen.
   Met `prefers-reduced-motion` staan beide stil.
3. **De kop condenseert.** Zodra je scrolt wordt de kop 12 pixels korter, wordt
   het beeldmerk kleiner en komt er een schaduw onder. Met `requestAnimationFrame`,
   dus het scrolen blijft soepel.
4. **De accentlijn.** Boven elke sectiekop staat een korte lijn in het signaal.
   Die groeit van links naar rechts zodra de sectie in beeld komt.

**De foto in de cirkel beweegt niet.** Een deining is geprobeerd en afgevallen:
een golf die je niet ziet is geen golf, en een golf die je wel zichtbaar ziet
gaat de foto overheersen. De foto is een stilstaand beeld van de haven, en dat
is sterker. De uitsnede zelf staat wel op 1,45, zodat je niet de hele foto ziet
maar een stuk: de zon, de paaltjes en het licht op het water.

Op hover reageren de menurijen (een teal hairline trekt over de regel en de prijs
schuift 4 pixels op), de fotokaarten (het beeld komt 4 procent dichterbij) en de
knoppen (de kleur wisselt, de pijl schuift).
Er is geen hoverlift, geen schaal op de hele kaart en geen `transition: all`.
Alle overgangen noemen hun eigenschappen en gebruiken de ene `--easing`.

Er wordt nooit tekst verborgen. Alleen lijnen en ringen bewegen. Daardoor
blijft de site leesbaar zonder JavaScript en bij het printen. Het scroll-reveal
van de eerste versie is weg: fade-in per sectie is een slop tell en liet
volledige screenshots en afdrukken leeg.

Met `prefers-reduced-motion` gebeurt er niets: geen enkele animatie draait dan,
en de ring staat meteen volledig getekend.

## Typografie van de tekst

De toon is die van de site die er was: gewone taal, geen marketingjargon. Korte
zinnen. Geen "totaaloplossing", geen "digitale transformatie", geen
"E-nummersvrij" als headline maar als bewijs. De woorden "haven", "vismijn",
"ambachtelijk" en "verse kruiden uit de eigen tuin" komen uit het materiaal zelf.

De site spreekt de klant aan in de tweede persoon. "Je haalt er verse vis direct
van de boot." Geen "wij bieden u".

Geen em dashes, geen emoji, geen puntkomma's als meta-scheiding. Openingstijden
staan als "10:00 tot 18:00", niet met een streepje.

## Opbouw van de pagina's

Elke pagina heeft dezelfde cadans: een held, dan een rustige kop met een
accentlijn, dan blokken die afwisselen van licht en licht-blauw.

De homepage begint met de held en daarna direct met **Vuur aan de kade**: drie
momenten, de kade, de rookoven en de tuin. Dat is het verhaal van de plek, en
het staat boven het aanbod, niet eronder. Daarna volgt een brede fotoband met de
haven, en pas dan de drie manieren om de winkel te vinden.

De vleespakketten staan niet in een menukaart maar in twee kaarten met de
prijs groot in het signaal, want dat is het getal waarop wordt vergeleken.

De **brede fotoband** (`HavenBand`) is de pauze in de pagina: een foto over de
volle breedte met één zin erop. Er staat er een op elke pagina behalve de
contactpagina.

Op een telefoon staat er een **vaste actiebalk** onderaan met Bellen en Offerte
aanvragen. Die staat er alleen tot 767 pixels en duwt de voetstuk niet weg: het
lichaam krijgt daar 68 pixels extra onderaan.

## Belangrijk bij het uitbreiden

1. Nieuwe kleuren gaan in `src/styles/global.css` als een rol met een OKLCH-waarde,
   nooit als losse hexwaarde. Daarna `npm run contrast`.
2. Nieuwe pagina's gebruiken `.rail`, `.sectie`, `Hero`, `SectieKop` en de
   `.knop`-klassen.
3. Teksten komen uit `src/data/site.ts`.
4. Nieuwe prijzen horen in een `Menukaart`, of in een `.vleespakket`-kaart als
   het om vlees voor de barbecue gaat. Niet als losse tekst in een kaart.
5. Foto's krijgen altijd een `alt` die beschrijft wat er staat, niet wat het thema is.
6. Er is geen zoekfunctie, geen filter en geen winkelmand. Voeg die niet toe zonder
   vraag; de site is een etalage, geen winkel.
7. Het beeldmerk komt uit `public/images/merk.png`. Die is met
   `node scripts/crop-logo.mjs` uit de originele afbeelding gesneden en krijgt
   een transparante achtergrond. `merk-wit.png` is de witte silhouet voor op een
   donkere vlakte.
8. De brede fotoband komt na een tekstblok, nooit direct na de held. Twee banden
   vlak na elkaar maken de pagina zwaar.
9. Alt-teksten moeten kloppen met wat er echt staat. De foto's van Wesley en
   Marjoleine zijn bijgewerkt toen de bijsnede veranderde, want een `alt` die
   niet overeenkomt is een kleine leugen.

## Geteste punten

- Contrast: 28 paren gemeten met `npm run contrast`, allemaal WCAG 2.2 AA.
- Toetsenbord: focus zichtbaar via `:focus-visible` met offset 2px, geen focusring
  op de pointer, mobiel menu sluit met Escape, FAQ opent met Enter.
- Zonder JavaScript blijft alle tekst zichtbaar, gecontroleerd in de browser.
- Content rail op alle zes pagina's op 112px van de rand, gemeten in de browser.
- Geen animaties met `prefers-reduced-motion`, gecontroleerd in de browser.
- Geen emoji, geen em dash, geen afbeelding zonder alt, geen element zonder
  toegankelijke naam, over alle zes pagina's gecontroleerd met `npm run verify:ui`.
- Geen horizontale overloop op 320, 390, 768, 1024, 1280 en 1440 px, gecontroleerd
  met `node scripts/check-overflow.mjs`.
- Alle interne links, ankers en brochure-pdf's werken, gecontroleerd in de browser.
- Het contactformulier is een demonstratie: het verzendt en opslaat niets en toont
  na verzenden expliciet dat er niets is verstuurd of opgeslagen.

## Afspraken uit de klantplek

De klantplek "Wesleys Ambacht" in Notion stelt eisen aan dit concept. Deze zijn
in het ontwerp verwerkt:

| Eis | Wat het betekent in het ontwerp |
| --- | --- |
| Maximaal vijf sitepagina's | Home, ambachtswinkel, catering, vergaderen, contact. De 404 telt niet mee. |
| Privéconcept, geen livegang | Er is niets gepubliceerd. De preview draait lokaal. |
| Linkkaart zonder klantfoto's | `linkkaart.png` is een eigen beeld in de huisstijl, zonder foto's van de klant. |
| Formulier is demonstratie | Het formulier verzendt en opslaat niets en zegt dat na verzenden. |
| Bron, leestijd, open punten, controleerbaar resultaat | Staan in de overdracht in Notion, in het issue in Linear en in het HTML-document. |
| Houd concept en live gescheiden | De overdracht benoemt elke stap die nog nodig is voor livegang. |
| Geen klantcontact, geen kosten | Er is niets verstuurd, besteld of betaald. |
| Vragen en vastlopers via het Linear-issue | Het issue WEB-49 is daarvoor de plek. |
