/**
 * Voegt in de overdrachtspagina in Notion een verwijzing toe naar de
 * pagina met de HTML van de website.
 *
 * Run: node scripts/notion-kruisverwijzing.mjs
 */
import { readFile } from 'node:fs/promises';

const env = await readFile(`${process.env.HOME}/AppData/Local/hermes/.env`, 'utf8');
const token = env.match(/^NOTION_TOKEN=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');

const OVERDRACHT = '4064c5f9-f8e5-811b-a3d4-f014171ce862';
const HTML_PAGINA = '4064c5f9-f8e5-8163-a9fb-ec0fdad107cb';

async function notion(pad, methode = 'GET', body = null) {
  const antwoord = await fetch(`https://api.notion.com/v1${pad}`, {
    method: methode,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const tekst = await antwoord.text();
  try {
    return { status: antwoord.status, json: JSON.parse(tekst) };
  } catch {
    return { status: antwoord.status, text: tekst.slice(0, 200) };
  }
}

const marker = 'De website zelf, als HTML';
const bestaande = await notion(`/blocks/${OVERDRACHT}/children?page_size=100`);
const alDaar = (bestaande.json?.results ?? []).some((b) =>
  (b.paragraph?.rich_text ?? []).some((r) => r.plain_text?.includes(marker)),
);

if (alDaar) {
  console.log('De verwijzing staat er al.');
  process.exit(0);
}

const toegevoegd = await notion(`/blocks/${OVERDRACHT}/children`, 'PATCH', {
  children: [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'De website zelf, als HTML' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'De vijf pagina’s van de website staan als HTML in een eigen pagina: ' +
                'https://app.notion.com/p/4064c5f9f8e58163a9fbec0fdad107cb',
            },
          },
        ],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'Per pagina een kindpagina met de volledige HTML, inclusief de CSS ' +
                'inline. De bestanden staan ook in handover/site/ in de projectmap, ' +
                'klaar om in een browser te openen.',
            },
          },
        ],
      },
    },
  ],
});

console.log(
  toegevoegd.status === 200
    ? `Verwijzing toegevoegd aan de overdrachtspagina.`
    : `Mislukt: ${toegevoegd.status} ${toegevoegd.json?.message ?? toegevoegd.text}`,
);
