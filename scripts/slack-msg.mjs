/**
 * Maakt het Slack-payload: het HTML-bestand om te uploaden en het bericht.
 *
 * Het bericht gaat naar #webrnds. Zenden kan op twee manieren:
 *
 *   1. Met een bot-token: zet SLACK_BOT_TOKEN in handover/.env en draai
 *      npm run handover:push. Dan uploadt het script het bestand en plaatst
 *      het bericht.
 *
 *   2. Zonder token: open #webrnds, sleep het bestand uit handover/site/
 *      in het bericht en plak de tekst uit handover/slack-bericht.txt.
 *
 * Run: node scripts/slack-msg.mjs
 */
import { writeFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataUrl = new URL('../src/data/site.ts', import.meta.url).href;
const data = await import(dataUrl);
const { site } = data;

const NOTION_HTML = 'https://app.notion.com/p/4064c5f9f8e58163a9fbec0fdad107cb';
const NOTION_OVERDRACHT = 'https://app.notion.com/p/4064c5f9f8e5811ba3d4f014171ce862';
const LINEAR = 'https://linear.app/webrnds/issue/WEB-49/wesley-websiteconcept-en-open-acceptatiepunten-bewaken';

const PAGINAS = [
  { bestand: 'index.html', titel: 'Home' },
  { bestand: 'ambachtswinkel.html', titel: 'Ambachtswinkel' },
  { bestand: 'catering.html', titel: 'Catering' },
  { bestand: 'vergaderen.html', titel: 'Vergaderen' },
  { bestand: 'contact.html', titel: 'Contact' },
  { bestand: '404.html', titel: 'Niet gevonden' },
];

const regels = [];
regels.push(`*De website van ${site.name} staat, met de HTML erbij.*`);
regels.push('');
regels.push(
  "Vijf pagina's in het merk “Havenlicht”: licht en helder, zeeblauw als inkt en een teal dat aan het signaal van de haven doet denken. De volledige HTML van elke pagina staat in het bijgevoegde bestand en in de Notion- en Linear-links hieronder.",
);
regels.push('');
regels.push('*De pagina’s:*');
regels.push('');
for (const pagina of PAGINAS) {
  const grootte = statSync(path.join(root, 'handover', 'site', pagina.bestand)).size;
  regels.push(`• ${pagina.titel} — \`${pagina.bestand}\` (${(grootte / 1024).toFixed(1)} kB)`);
}
regels.push('');
regels.push(
  `• De HTML in Notion: <${NOTION_HTML}|open de website in HTML>`,
  `• De overdracht met merk, prijzen en open punten: <${NOTION_OVERDRACHT}|open de overdracht>`,
  `• De taken in Linear: <${LINEAR}|WEB-49>`,
);
regels.push('');
regels.push(
  'Gedaan en gecontroleerd: contrast 28 paren op WCAG AA, toetsenbord en mobiel menu getest, leesbaar zonder JavaScript, geen overloop van 320 tot 1440 px, contactformulier verzendt en opslaat niets, linkkaart zonder klantfoto’s. Het pakket bevat zowel de kant-en-klare HTML als de broncode.',
);

const bericht = regels.join('\n');
await writeFile(path.join(root, 'handover', 'slack-bericht.txt'), `${bericht}\n`, 'utf8');
console.log('Slack-bericht geschreven naar handover/slack-bericht.txt');
console.log(`${bericht.length} tekens, ${bericht.split('\n').length} regels`);
