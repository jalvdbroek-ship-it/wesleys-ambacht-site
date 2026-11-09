/**
 * Alle inhoud van de website van Wesley's Ambacht.
 * Bron: ambachtbijwesley.nl (ook bereikbaar als ambachtswinkel.nl), de brochure-PDF's
 * en de productfoto's. Het e-mailadres en de Instagram-handle komen van de
 * huidige site en blijven ongewijzigd.
 * Prijzen zijn inclusief btw, tenzij anders vermeld.
 */

export const site = {
  name: "Wesley's Ambacht",
  tagline: 'Verse vis van de vismijn. Ambachtelijke catering. Vergaderen met uitzicht.',
  url: 'https://ambachtbijwesley.nl',
  email: 'info@ambachtswinkel.nl',
  phone: '+31 6 39 58 11 28',
  phoneHref: '+31639581128',
  whatsapp: 'https://wa.me/31639581128',
  instagram: 'https://www.instagram.com/ambachtswinkel/',
  facebook:
    'https://www.facebook.com/people/De-Ambachtswinkel/100090758690891/',
  address: {
    straat: 'Meester Snijderweg 5 (voorzijde)',
    postcode: '3251 LJ',
    plaats: 'Stellendam',
    land: 'Nederland',
  },
  maps: 'https://www.google.com/maps/search/?api=1&query=Meester+Snijderweg+5%2C+3251+LJ+Stellendam',
  openingstijden: [
    { dag: 'Dinsdag t/m vrijdag', tijd: '10:00 tot 18:00' },
    { dag: 'Zaterdag', tijd: '10:00 tot 18:00' },
    { dag: 'Zondag en maandag', tijd: 'Gesloten' },
  ],
  /** Sluitmelding op de huidige site. */
  sluiting: {
    van: '26 oktober',
    tot: '8 november',
    weerOpen: 'dinsdag 10 november',
  },
};

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/ambachtswinkel', label: 'Ambachtswinkel' },
  { href: '/catering', label: 'Catering' },
  { href: '/vergaderen', label: 'Vergaderen' },
  { href: '/contact', label: 'Contact' },
];

/** De drie stappen van een aanvraag, gebruikt op de homepage en de contactpagina. */
export const stappen = [
  {
    stap: '01',
    titel: 'Je stuurt je aanvraag',
    tekst: 'Hoe uitgebreider je vraag, hoe gerichter ons antwoord.',
  },
  {
    stap: '02',
    titel: 'We bellen binnen één werkdag',
    tekst: 'We vragen door tot we weten wat je wilt en hoeveel mensen er komen.',
  },
  {
    stap: '03',
    titel: 'Je krijgt een offerte',
    tekst: 'Inclusief wat we doen, in welke volgorde en wat het kost.',
  },
];

export const openingstijdenCompact = 'Di t/m za, 10:00 tot 18:00';

/**
 * De kern van de plek: de haven en het vuur, dicht op elkaar.
 * Dit is het verhaal dat de homepage vertelt.
 */
export const vuurEnKade = {
  eyebrow: 'Haven en vuur',
  titel: 'Vuur aan de kade',
  tekst:
    'De vismijn staat om de hoek. De rookoven en de grill staan in de winkel. Tussen die twee in ligt alles wat wij maken: vis die over de kade komt, vlees dat over het vuur gaat, en kruiden uit de tuin erachter.',
  momenten: [
    {
      label: 'De kade',
      titel: 'Verse vis, elke week',
      tekst:
        'De vismijn ligt om de hoek en levert elke week verse vis aan. Wat er precies ligt, hangt af van de visserij.',
      afbeelding: '/images/zonsondergang-vissershaven.jpg',
      alt: 'Vissersboten aan de haven van Stellendam bij zonsondergang, met de zon in het water.',
    },
    {
      label: 'De rookoven',
      titel: 'Zelf gerookt',
      tekst:
        'Wesley rookt zijn eigen zalm en paling. Langzaam, zonder kunstmatige toevoegingen, en dat proef je terug.',
      afbeelding: '/images/instagram-1.jpeg',
      alt: 'Wesley aan het rooster met worsten en hamburgers, met rook boven het vuur.',
    },
    {
      label: 'De tuin',
      titel: 'Verse kruiden',
      tekst:
        'Marjoleine haalt de kruiden uit de eigen tuin en maakt de gerechten af. Geen poespas, wel eerlijk eten.',
      afbeelding: '/images/Marjoleine.jpg',
      alt: 'Marjoleine met een dienblad met broodjes tijdens een evenement.',
    },
  ],
};

/** Het menu van de vismijn, zoals het op de homepage staat. */
export const visKaart: Product[] = [
  {
    naam: 'Verse vis van de boot',
    prijs: 'Vraag het',
    omschrijving:
      'Elke week vers aangeleverd uit de vismijn. Wat er ligt, hangt af van de visserij.',
  },
  {
    naam: 'Plateau gebakken vis',
    prijs: '€ 14,50 p.p.',
    omschrijving: 'Gebakken vis met bijbehorende sauzen.',
  },
  {
    naam: 'Gerookte zalm, zelf gerookt',
    prijs: 'Vraag het',
    omschrijving:
      'Langzaam gerookt, zonder kunstmatige toevoegingen. Plakken voor thuis of voor de borrel.',
  },
  {
    naam: 'Huisgerookte palingfilet',
    prijs: 'Vraag het',
    omschrijving: 'Uit de eigen rookoven. Filet voor thuis of voor de borrel.',
  },
  {
    naam: 'Verse broodjes',
    omschrijving:
      'Met het brood van Bakkerij van Harberden. Gerookte zalm, paling, pulled pork of ambachtelijke worst.',
  },
];

/** Hoe een avond met barbecue op locatie verloopt. */
export const grillAvond = [
  {
    moment: 'We komen',
    tekst: 'Wij zetten op, brengen het materiaal en zorgen dat alles klaarstaat voor je gasten.',
  },
  {
    moment: 'Het vuur gaat aan',
    tekst:
      'De grill en de rookoven warmen op. Wesley bepaalt het vuur, de temperatuur en het moment waarop het vlees klaar is.',
  },
  {
    moment: 'Je gasten komen',
    tekst: 'Hapjes of een walking diner, terwijl het vuur doet wat het hoort te doen.',
  },
  {
    moment: 'Het eten gaat op tafel',
    tekst: 'Vlees van het vuur, vis uit de haven, en alles wat erbij hoort.',
  },
];

/** Wat er om de winkel heen ligt, op loopafstand. */
export const havenRondje = [
  { plaats: 'De vismijn', wat: 'Om de hoek. Verse vis, elke week aangeleverd.' },
  { plaats: 'Pel Centrale', wat: 'Onze achterburen aan de haven. Verse garnalen.' },
  { plaats: 'Het havenplein', wat: 'Terrassen, de havenkroeg en de zonsondergang.' },
  { plaats: 'De kust', wat: 'Vijf minuten lopen naar de Noordzee.' },
];

/** De vier beloften van de winkel, in de volgorde van de site. */
export const beloften = [
  {
    titel: 'Verse vis',
    tekst: 'Direct van de vismijn. Elke week vers aangeleverd.',
  },
  {
    titel: 'Ambachtelijke producten',
    tekst: 'Gerookt vlees, vis en specialiteiten. Huisgemaakt door Wesley en Marjoleine.',
  },
  {
    titel: 'Afhaalmaaltijden',
    tekst: 'Stel zelf samen: aardappel, groenten en vlees. Warm klaar voor thuis.',
  },
  {
    titel: 'Verse broodjes',
    tekst: 'Vers belegd met onze producten. Gerookte zalm, paling, pulled pork en meer.',
  },
  {
    titel: 'Patat en snacks',
    tekst: 'Verse patat met kibbeling en zelfgemaakte snacks.',
  },
  {
    titel: 'Terras aan het water',
    tekst: 'Opeten aan de haven of meenemen. Jij kiest.',
  },
];

export const overOns = {
  intro:
    'De Ambachtswinkel staat op de buitenhaven van Stellendam, naast de vismijn. Je haalt er verse vis direct van de boot, ambachtelijke producten van Wesley en Marjoleine, en eet je ze desgewenst meteen op het terras met uitzicht over het water.',
  duo: [
    {
      naam: 'Wesley',
      rol: 'Meester van het vuur',
      tekst: 'Wesley staat achter de grill en de rookoven. Hij bepaalt het vuur, de temperatuur en het moment waarop het vlees klaar is.',
      afbeelding: '/images/wesley-marjoleine-werken.jpeg',
      alt: 'Wesley achter de tap, met een spatel boven de worsten op de grill.',
      positie: 'center 30%',
    },
    {
      naam: 'Marjoleine',
      rol: 'Kruidenliefhebber',
      tekst: 'Marjoleine stuurt de smaken aan met verse kruiden uit de eigen tuin. Zij maakt de gerechten af en houdt de presentatie bij.',
      afbeelding: '/images/Marjoleine.jpg',
      alt: 'Marjoleine met een dienblad met broodjes tijdens een evenement.',
      positie: 'center 40%',
    },
  ],
  samen: {
    afbeelding: '/images/havenpaviljoen.jpg',
    alt: 'Het terras van de Ambachtswinkel aan de buitenhaven van Stellendam bij zonsondergang, met tafels en parasollen aan het water.',
  },
  passie:
    'Geen poespas, wél eerlijk: gegrild en gerookt vlees en vis, zonder E-nummers, met verse kruiden uit de eigen tuin.',
};

/** Producten met prijzen, uit de website en de brochure-PDF's. */
export type Product = {
  naam: string;
  prijs?: string;
  omschrijving: string;
  details?: string[];
  afbeelding?: string;
  alt?: string;
  brochure?: { href: string; label: string };
};

export const vleespakketten: Product[] = [
  {
    naam: 'Vleespakket basis',
    prijs: '€ 9,95 p.p.',
    omschrijving: 'Vijf soorten vlees voor de barbecue, voor iedereen.',
    details: [
      'Kipsaté',
      'Kip shaslick',
      'Classic hamburger',
      'BBQ worst',
      'Speklap gemarineerd',
    ],
    brochure: { href: '/brochures/pdf_VleesBasis.pdf', label: 'Brochure vleespakket basis' },
  },
  {
    naam: 'Vleespakket luxe',
    prijs: '€ 13,95 p.p.',
    omschrijving: 'Uit te breiden met een chef op locatie. Maximaal vijf personen.',
    details: [
      'Kipsaté',
      'Varkenshaasspies',
      'Black Angus burger',
      'BBQ worst met jalapeño en cheddar',
      'Spareribs in BBQ-saus',
      'Procureurlap',
      'Zalm in hollandaise',
      'Gambaspies',
      'Biefstukspies',
    ],
    brochure: { href: '/brochures/pdf_VleesLuxe.pdf', label: 'Brochure vleespakket luxe' },
  },
];

export const salades: Product[] = [
  { naam: 'Pastasalade pesto', prijs: '€ 8,50', omschrijving: 'Vegetarisch.' },
  { naam: 'Carpaccio salade', prijs: '€ 10,95', omschrijving: 'Rijk gevuld.' },
  { naam: 'Rijke vleessalade', prijs: '€ 14,50', omschrijving: 'Met ambachtelijk vlees.' },
  { naam: 'Rijke vissalade', prijs: '€ 17,50', omschrijving: 'Verse vis, rijk gevuld.' },
];

export const borrelplanken: Product[] = [
  {
    naam: 'Grillworst, charcuterie, kaas',
    prijs: '€ 6,50 p.p.',
    omschrijving: 'De basis. Vanaf 10 personen, een dag van tevoren bestellen.',
  },
  {
    naam: 'Grillworst, charcuterie, kaas en worstenbroodje',
    prijs: '€ 8,50 p.p.',
    omschrijving: 'Met een worstenbroodje erbij.',
  },
  {
    naam: 'Speksoorten, charcuterie, kaas',
    prijs: '€ 10,00 p.p.',
    omschrijving: 'Uit eigen ambachtelijke worst.',
  },
  {
    naam: 'Speksoorten, charcuterie, kaas en gerookte zalm',
    prijs: '€ 12,50 p.p.',
    omschrijving: 'Met gerookte zalm van eigen huis.',
  },
  {
    naam: 'Speksoorten, charcuterie, kaas, gerookte paling en olijven',
    prijs: '€ 15,00 p.p.',
    omschrijving: 'De meest complete plank.',
  },
];

export const buffetten: Product[] = [
  {
    naam: 'Stamppotbuffet basis',
    prijs: '€ 17,00 p.p.',
    omschrijving: 'Andijvie, boerenkool of hutspot. Eigen gehaktbal, huisgerookte worst en speklapje.',
  },
  {
    naam: 'Stamppotbuffet luxe',
    prijs: '€ 22,50 p.p.',
    omschrijving: 'Met soep vooraf: erwtensoep, witlofsoep of tomatensoep.',
  },
  {
    naam: 'Warm buffet',
    prijs: '€ 24,00 p.p.',
    omschrijving: 'Vier keuzes uit vlees en vis, vier salades, brood en smeersels, fruitsalade en sauzen.',
  },
  {
    naam: 'BBQ buffet basis',
    prijs: '€ 19,00 p.p.',
    omschrijving: 'Maximaal vijf hapjes per gast. Kok inbegrepen, op basis van nacalculatie.',
  },
  {
    naam: 'BBQ buffet luxe',
    prijs: '€ 23,50 p.p.',
    omschrijving: 'Black Angus burger, biefstukspies, sparerib, zalm met hollandaise en meer.',
  },
];

export const broodjes: Product = {
  naam: 'Broodjeslunch',
  omschrijving:
    'Huisgemaakte belegde broodjes met het brood van Bakkerij van Harberden in Melissant. Voor lunch en events.',
  details: [
    'Gerookte zalm',
    'Huisgerookte palingfilet',
    'Pulled pork',
    'Kip shaslick',
    'Ambachtelijke grillworst',
  ],
  brochure: { href: '/brochures/pdf_Broodjes.pdf', label: 'Brochure broodjes' },
};

export const koffie: Product = {
  naam: 'Volautomaat huren',
  prijs: 'vanaf € 50 per dag',
  omschrijving:
    'Volautomatisch koffiezetapparaat voor je feest of partij, met bonen van Roger’s Coffee service. Slow roast, diverse melanges.',
  details: ["Roger’s Choice: Medium", 'Dark Roast', 'Full City'],
  brochure: { href: '/brochures/pdf_Koffie.pdf', label: 'Brochure koffie' },
};

export const catering = [
  {
    titel: 'BBQ op locatie',
    tekst: 'Wij komen naar jou toe voor een onvergetelijke barbecue-ervaring. Volledig verzorgd, met of zonder bediening.',
    punten: ['Volledig verzorgd', 'Kok en bediening in te huren', 'Eigen barbecue of onze'],
  },
  {
    titel: 'Walking diner',
    tekst: 'Verfijnde kleine gerechten van de barbecue, die rondgaan langs je gasten.',
    punten: ['Vers en zuiver', 'Alles uit de eigen keuken'],
  },
  {
    titel: 'Hapjes',
    tekst: 'Bereid met onze ambachtelijke producten. Zonder E-nummers, met verse kruiden.',
    punten: ['Zonder E-nummers', 'Op locatie of af te halen'],
  },
  {
    titel: 'Gerookte vis',
    tekst: 'Eerlijke producten, zonder kunstmatige toevoegingen. Authentiek bereid.',
    punten: ['Zelf gerookt', 'Zonder E-nummers'],
  },
  {
    titel: 'Buffetten en arrangementen',
    tekst: 'Volledig warm buffet, BBQ-arrangementen en stamppotten. Alle combinaties en prijzen overzichtelijk bij elkaar.',
    punten: ['Vanaf 10 personen', 'Brochure met alle opties'],
  },
  {
    titel: 'Broodjeslunch',
    tekst: 'Huisgemaakte belegde broodjes met brood van Bakkerij van Harberden. Ideaal voor lunch en events.',
    punten: ['Belegd naar keuze', 'Verse levering'],
  },
];

export const vergaderArrangementen: { naam: string; prijs: string; omschrijving: string }[] = [
  {
    naam: 'Huur vergaderruimte',
    prijs: '€ 120 per dagdeel',
    omschrijving: 'Volledig ingericht met flipover, whiteboard en op aanvraag een beamer.',
  },
  {
    naam: 'Koffie-arrangement',
    prijs: '€ 11,50 p.p.',
    omschrijving: 'Onbeperkt koffie, thee, water en koekjes.',
  },
  {
    naam: 'Uitgebreid arrangement',
    prijs: '€ 16,50 p.p.',
    omschrijving: 'Onbeperkt koffie, thee, water, koekjes, gebak en frisdrank.',
  },
  {
    naam: 'Fruitmand',
    prijs: '€ 2,50 p.p.',
    omschrijving: 'Verse fruit in de vergaderruimte.',
  },
  {
    naam: 'Lunchbuffet basis',
    prijs: '€ 15,50 p.p.',
    omschrijving: 'Broodje kaas, boerenham of salami, filet american, zalm of krabsalade, eiersalade.',
  },
  {
    naam: 'Lunchbuffet luxe',
    prijs: '€ 21,50 p.p.',
    omschrijving: 'Broodje grillworst, huisgerookte zalm, palingfilet, makreelrilette, tonijnsalade, eiersalade, carpaccio.',
  },
  {
    naam: 'Bittergarnituur',
    prijs: '€ 11,50 p.p.',
    omschrijving: 'Een borrelplank met onze ambachtelijke producten.',
  },
  {
    naam: 'Plateau gebakken vis',
    prijs: '€ 14,50 p.p.',
    omschrijving: 'Gebakken vis met bijbehorende sauzen.',
  },
  {
    naam: 'Borrelplank ambachtelijk',
    prijs: '€ 18,50 p.p.',
    omschrijving: 'Rijk gevulde borrelplank met grillworst, speksoorten, gerookte zalm, charcuterie en kaas.',
  },
];

/** Lokale samenwerkingen, overgenomen van de Ambachtswinkelpagina. */
export const samenwerkingen = [
  { naam: 'Bakkerij van Harberden', wat: 'Vers gebakken brood voor onze ambachtelijke broodjes' },
  { naam: 'Landwinkel Keijzer', wat: 'Verse groenten rechtstreeks van het land' },
  { naam: 'Pel Centrale', wat: 'Verse garnalen, onze achterburen aan de haven' },
  { naam: 'Vismijn Stellendam', wat: 'Verse vis direct van de vismijn, elke week aangeleverd' },
  { naam: 'Rabarber Bubbels', wat: 'Lokale bubbels uit het hart van Stellendam' },
  { naam: 'Goedereede Wijnen', wat: 'Zorgvuldig geselecteerde wijnen uit de regio' },
  { naam: 'Kaasboerderij van Schaik', wat: 'Ambachtelijke kaas en zuivel uit Stellendam' },
];

/** Reviews van de site, overgenomen inclusief datum. */
export const reviews = [
  {
    naam: 'Piet Kagchelland',
    datum: '29 december 2024',
    tekst:
      'Afgelopen weekend een catering bij Wesley laten bezorgen, top kwaliteit eten goed verzorgd en meer dan voldoende als je per persoon bestelt.',
  },
  {
    naam: 'Sarah Kampman',
    datum: '10 maart 2024',
    tekst:
      'Wat je hier ook haalt, het is een feestje. Je proeft de liefde en ambacht. Heerlijk eten en uitstekende waarde.',
  },
  {
    naam: 'Marleen Vlaspoel',
    datum: '7 mei 2023',
    tekst:
      'Helemaal top! Zowel de koudgerookte zalm als de grillworst (naturel) smaakten meer dan prima. Dikke aanrader.',
  },
  {
    naam: 'Hans Grinwis',
    datum: '31 maart 2023',
    tekst:
      'Heerlijke, eerlijke producten zonder toevoegingen en E-nummers.',
  },
];

/** Instagram-feed, overgenomen van de site. */
export const instagramPosts = [
  {
    afbeelding: '/images/instagram-1.jpeg',
    alt: 'Wesley aan het rooster met worsten en hamburgers, met rook boven het vuur.',
    titel: 'Onze chef Wesley is aan het grillen',
    likes: 127,
    reacties: 8,
  },
  {
    afbeelding: '/images/instagram-2.jpg',
    alt: 'Wesley en Marjoleine met dienbladen vol broodjes tijdens een evenement.',
    titel: 'Het team in actie',
    likes: 89,
    reacties: 12,
  },
  {
    afbeelding: '/images/Wesley-BBQ-op-locatie.jpeg',
    alt: 'Wesley bij de barbecue op locatie, met de kofferwagen van Wesley’s Ambacht.',
    titel: 'Ambachtelijke burgers op de grill',
    likes: 156,
    reacties: 15,
  },
  {
    afbeelding: '/images/instagram-4.jpeg',
    alt: 'Wesley en Marjoleine bij de barbecue, met worsten en pulled pork in de bakken.',
    titel: 'Heerlijke broodjes met worst',
    likes: 98,
    reacties: 6,
  },
];

export const faqs = [
  {
    vraag: 'Moet ik vooruit betalen?',
    antwoord:
      'Voor buffetten vanaf 10 personen en voor catering op locatie maken wij een offerte op maat. De prijzen op de site zijn inclusief btw en gelden zolang de samenstelling hetzelfde blijft.',
  },
  {
    vraag: 'Komen jullie ook op locatie?',
    antwoord:
      'Ja. Voor BBQ, buffetten, walking diner en hapjes komen wij naar jouw locatie. De kok en bediening kunnen wij regelen, vanaf 57,50 per uur inclusief btw per persoon.',
  },
  {
    vraag: 'Wat zit er bij de buffetten?',
    antwoord:
      'Bij de buffetten is brood met smeersels, fruitsalade, knoflooksaus en cocktailsaus standaard inbegrepen. Bestek, borden en buffettafels zijn dat niet, die worden apart berekend.',
  },
  {
    vraag: 'Hoe lang vooruit moet ik bestellen?',
    antwoord:
      'Voor borrelplanken adviseren wij minimaal tien personen en een dag van tevoren bestellen. Salades bestel je vanaf vijf personen. Voor buffetten geldt een minimum van tien personen.',
  },
  {
    vraag: 'Kunnen jullie de vergaderruimte huren?',
    antwoord:
      'Ja. De ruimte is 120 per dagdeel en standaard ingericht met flipover en whiteboard. Een beamer huur je op aanvraag. Koffie, lunch en borrel kunnen we erbij verzorgen.',
  },
  {
    vraag: 'Hebben jullie ook een terras?',
    antwoord:
      'De Ambachtswinkel heeft een terras aan de buitenhaven met uitzicht over het water. Je kunt bij ons eten, of je haalt je afhaalmaaltijd mee naar huis.',
  },
];

export const kosten = {
  kokPerUur: '€ 57,50 per uur inclusief btw',
  schoonmaak: '€ 25,00 inclusief btw',
  borden: '€ 5,00 per 10 inclusief schoonmaakkosten',
  bestek: '€ 2,50 per 10 inclusief schoonmaakkosten',
  buffettafel: '€ 15,00 per buffettafel',
};

/** Aankondiging op de site, overgenomen uit de aankondigingssectie. */
export const aankondiging = {
  titel: 'Weet joe ut al?',
  tekst: 'Houdt onze socials in de gaten voor verdere info.',
  link: 'https://www.instagram.com/ambachtswinkel/',
};
