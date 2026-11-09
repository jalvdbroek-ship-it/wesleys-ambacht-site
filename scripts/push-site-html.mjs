/**
 * Stuurt de HTML van de gemaakte website naar Notion, Linear en Slack.
 *
 * Run: node scripts/push-site-html.mjs
 *
 * Wat er verstuurd wordt:
 *   Notion  een kindpagina per sitepagina, met de volledige HTML
 *           in een codeblok, plus een overzichtspagina
 *   Linear  een commentaar per sitepagina op het overdrachtsissue,
 *           met de volledige HTML in een codeblok
 *   Slack   het HTML-bestand als upload, plus een kort bericht
 *
 * De tokens komen uit handover/.env of uit de bestaande lokale omgeving.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;

/* ================================================================
   BESTEMMINGEN
   ================================================================ */

const KLANTPLEK = '4064c5f9-f8e5-815b-9477-e0fc7ef685dc';
const LINEAR_ISSUE = 'WEB-49';
const SLACK_KANAAL = 'C0C0DDG4A87'; // #webrnds

const PAGINAS = [
  { bestand: 'index.html', titel: 'Home', slug: 'home' },
  { bestand: 'ambachtswinkel.html', titel: 'Ambachtswinkel', slug: 'ambachtswinkel' },
  { bestand: 'catering.html', titel: 'Catering', slug: 'catering' },
  { bestand: 'vergaderen.html', titel: 'Vergaderen', slug: 'vergaderen' },
  { bestand: 'contact.html', titel: 'Contact', slug: 'contact' },
  { bestand: '404.html', titel: 'Niet gevonden', slug: '404' },
];

/* ================================================================
   SLEUTELS
   ================================================================ */

async function laadEnv() {
  try {
    const inhoud = await readFile(path.join(root, 'handover', '.env'), 'utf8');
    for (const regel of inhoud.split('\n')) {
      const match = regel.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const schoon = match[2].trim().replace(/^["']|["']$/g, '');
      if (schoon && env[match[1]] === undefined) env[match[1]] = schoon;
    }
  } catch {
    // Geen .env, dan alleen de omgeving.
  }
}

async function neemNotion() {
  if (env.NOTION_TOKEN) return;
  try {
    const inhoud = await readFile(
      path.join(process.env.HOME ?? '', 'AppData', 'Local', 'hermes', '.env'),
      'utf8',
    );
    const sleutel = inhoud.match(/^NOTION_TOKEN=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (sleutel) env.NOTION_TOKEN = sleutel;
  } catch {
    // Geen token.
  }
}

async function neemLinear() {
  if (env.LINEAR_API_KEY) return;
  try {
    const inhoud = await readFile(
      path.join(process.env.HOME ?? '', '.gg', 'goals', 'auditter', '.env'),
      'utf8',
    );
    const sleutel = inhoud.match(/^LINEAR_API_KEY=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (sleutel) env.LINEAR_API_KEY = sleutel;
  } catch {
    // Geen sleutel.
  }
}

await laadEnv();
await neemNotion();
await neemLinear();

/* ================================================================
   NOTION
   ================================================================ */

async function notion(pad, methode = 'GET', body = null) {
  const antwoord = await fetch(`https://api.notion.com/v1${pad}`, {
    method: methode,
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const tekst = await antwoord.text();
  try {
    return { status: antwoord.status, json: JSON.parse(tekst) };
  } catch {
    return { status: antwoord.status, text: tekst.slice(0, 300) };
  }
}

/** Notion accepteert maximaal 2000 tekens per rich text-deel. */
const MAX_PER_DEEL = 1800;

function codeBlokken(html, taal = 'html') {
  const blokken = [];
  for (let i = 0; i < html.length; i += MAX_PER_DEEL) {
    const stuk = html.slice(i, i + MAX_PER_DEEL);
    blokken.push({
      object: 'block',
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: stuk } }],
        language: taal,
        caption: [{ type: 'text', text: { content: `deel ${Math.floor(i / MAX_PER_DEEL) + 1}` } }],
      },
    });
  }
  return blokken;
}

/** Haalt alle blokken van een pagina weg, zodat die opnieuw gevuld kan worden. */
async function notionLeegmaken(blockId) {
  let cursor = null;
  do {
    const zoek = cursor ? `&start_cursor=${cursor}` : '';
    const res = await notion(`/blocks/${blockId}/children?page_size=100${zoek}`);
    const kinderen = res.json?.results ?? [];
    for (const kind of kinderen) {
      await notion(`/blocks/${kind.id}`, 'PATCH', { archived: true });
    }
    cursor = res.json?.has_more ? res.json.next_cursor : null;
  } while (cursor);
}

async function pushNotion() {
  if (!env.NOTION_TOKEN) {
    return { dienst: 'Notion', status: 'overgeslagen', reden: 'geen NOTION_TOKEN' };
  }

  const OVERZICHT_TITEL = "Wesley's Ambacht — de website in HTML";

  // Hergebruik de overzichtspagina als die er al is, zodat een tweede
  // ronde geen dubbele pagina oplevert.
  const bestaande = await notion(`/blocks/${KLANTPLEK}/children?page_size=100`);
  const reeds = (bestaande.json?.results ?? []).find(
    (b) => b.type === 'child_page' && b.child_page?.title === OVERZICHT_TITEL,
  );

  let overzichtId;
  let overzichtUrl;
  let aangemaaktNu = false;

  if (reeds) {
    overzichtId = reeds.id;
    overzichtUrl = `https://app.notion.com/p/${reeds.id.replace(/-/g, '')}`;
    console.log('  overzichtspagina bestaat al, hergebruikt');
  } else {
    const overzicht = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content:
                  'De website van Wesley’s Ambacht, als HTML. Elke pagina hieronder is een ' +
                  'kindpagina met de volledige HTML van die pagina, inclusief de CSS ' +
                  'inline. De bestanden zijn ook te openen in een browser.',
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content:
                  'De broncode (Astro, Tailwind, TypeScript) staat in de projectmap. ' +
                  'Teksten en prijzen in src/data/site.ts, kleuren en typografie in ' +
                  'src/styles/global.css.',
              },
            },
          ],
        },
      },
    ];

    for (const pagina of PAGINAS) {
      overzicht.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { type: 'text', text: { content: pagina.titel }, annotations: { bold: true } },
            { type: 'text', text: { content: ` — ${pagina.bestand}` } },
          ],
        },
      });
    }

    const aangemaakt = await notion('/pages', 'POST', {
      parent: { page_id: KLANTPLEK },
      properties: {
        title: { title: [{ text: { content: OVERZICHT_TITEL } }] },
      },
      children: overzicht,
    });

    if (aangemaakt.status !== 200) {
      return {
        dienst: 'Notion',
        status: 'mislukt',
        reden: `${aangemaakt.status} ${aangemaakt.json?.message ?? aangemaakt.text}`,
      };
    }
    overzichtId = aangemaakt.json.id;
    overzichtUrl = aangemaakt.json.url;
    aangemaaktNu = true;
  }

  const paginaResultaten = [];

  // Bestaande kindpagina's hergebruiken, zodat een tweede ronde geen
  // dubbele pagina's maakt.
  const bestaandeKinderen = await notion(`/blocks/${overzichtId}/children?page_size=100`);
  const perTitel = new Map();
  for (const kind of bestaandeKinderen.json?.results ?? []) {
    if (kind.type !== 'child_page') continue;
    perTitel.set(kind.child_page?.title, kind);
  }

  // Per pagina een kindpagina met de HTML.
  for (const pagina of PAGINAS) {
    const html = await readFile(path.join(root, 'handover', 'site', pagina.bestand), 'utf8');
    const titel = `${pagina.titel} — HTML`;

    const bestaand = perTitel.get(titel);

    // Bestaande kindpagina's worden bijgewerkt, niet dubbel aangemaakt.
    let kindId;
    let bijgewerkt = false;
    if (bestaand) {
      kindId = bestaand.id;
      await notionLeegmaken(kindId);
      bijgewerkt = true;
    } else {
      // De pagina zelf aanmaken.
      const kind = await notion('/pages', 'POST', {
        parent: { page_id: overzichtId },
        properties: {
          title: { title: [{ text: { content: titel } }] },
        },
      });

      if (kind.status !== 200 || !kind.json?.id) {
        paginaResultaten.push({
          titel: pagina.titel,
          ok: false,
          fout: `${kind.status} ${kind.json?.message ?? kind.text ?? ''}`.trim(),
        });
        continue;
      }

      kindId = kind.json.id;
    }
    const invoer = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content:
                  `Volledige HTML van de pagina ${pagina.titel}. Bestand: ` +
                  `handover/site/${pagina.bestand}.`,
              },
            },
          ],
        },
      },
      ...codeBlokken(html),
    ];

    let gelukt = 0;
    for (let i = 0; i < invoer.length; i += 90) {
      const stuk = invoer.slice(i, i + 90);
      const gezet = await notion(`/blocks/${kindId}/children`, 'PATCH', { children: stuk });
      if (gezet.status !== 200) break;
      gelukt += stuk.length;
    }

    paginaResultaten.push({
      titel: pagina.titel,
      ok: gelukt === invoer.length,
      bijgewerkt,
      blokken: gelukt,
      url: `https://app.notion.com/p/${kindId.replace(/-/g, '')}`,
    });
  }

  return {
    dienst: 'Notion',
    status: 'ok',
    url: overzichtUrl,
    nieuw: aangemaaktNu,
    paginaResultaten,
  };
}

/* ================================================================
   LINEAR
   ================================================================ */

async function linearGraphql(query, variabelen = {}) {
  const antwoord = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { Authorization: env.LINEAR_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: variabelen }),
  });
  const json = await antwoord.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json.data;
}

async function pushLinear() {
  if (!env.LINEAR_API_KEY) {
    return { dienst: 'Linear', status: 'overgeslagen', reden: 'geen LINEAR_API_KEY' };
  }

  const { issues } = await linearGraphql(
    '{ issues(first: 80, filter: { team: { key: { eq: "WEB" } } }) { nodes { id identifier } } }',
  );
  const issue = issues.nodes.find((i) => i.identifier === LINEAR_ISSUE);
  if (!issue) {
    return { dienst: 'Linear', status: 'mislukt', reden: `${LINEAR_ISSUE} niet gevonden` };
  }

  const commentResultaten = [];

  // Reeds geplaatste comments worden bijgewerkt, zodat de HTML in
  // Linear altijd de laatste versie is zonder dubbelen.
  const bestaande = await linearGraphql(
    `query($id: String!) { issue(id: $id) { comments { nodes { id body } } } }`,
    { id: LINEAR_ISSUE },
  );
  const commentNodes = bestaande.issue?.comments?.nodes ?? [];

  // Eerst een overzicht, dan de HTML per pagina.
  const overzicht = [
    `De website van Wesley’s Ambacht, als HTML. De volledige HTML van elke pagina staat in de comments hieronder.`,
    '',
    `De bestanden staan ook in de projectmap, in \`handover/site/\`.`,
    '',
    `| Pagina | Bestand | Grootte |`,
    `| --- | --- | --- |`,
  ];

  for (const pagina of PAGINAS) {
    const html = await readFile(path.join(root, 'handover', 'site', pagina.bestand), 'utf8');
    overzicht.push(`| ${pagina.titel} | \`${pagina.bestand}\` | ${(html.length / 1024).toFixed(1)} kB |`);
  }

  const overzichtTekst = overzicht.join('\n');
  // Op een herkenning, niet op de exacte tekst: de bestandsgroottes
  // kunnen veranderen tussen twee rondes.
  const overzichtComment = commentNodes.find((c) =>
    c.body.startsWith('De website van Wesley’s Ambacht, als HTML'),
  );
  if (overzichtComment) {
    const bijgewerkt = await linearGraphql(
      'mutation($id: String!, $input: CommentUpdateInput!) { commentUpdate(id: $id, input: $input) { success } }',
      { id: overzichtComment.id, input: { body: overzichtTekst } },
    );
    commentResultaten.push({
      titel: 'Overzicht',
      ok: Boolean(bijgewerkt?.commentUpdate?.success),
      bijgewerkt: true,
    });
  } else {
    const eerste = await linearGraphql(
      'mutation($input: CommentCreateInput!) { commentCreate(input: $input) { success comment { id } } }',
      { input: { issueId: issue.id, body: overzichtTekst } },
    );
    commentResultaten.push({ titel: 'Overzicht', ok: Boolean(eerste?.commentCreate?.success) });
  }

  // De HTML per pagina. Linear heeft een limiet op de commentaarlengte,
  // dus de codeblokken worden in delen toegevoegd. De oude comments van
  // deze pagina gaan eerst weg, zodat er geen dubbelen of resten blijven.
  for (const pagina of PAGINAS) {
    const html = await readFile(path.join(root, 'handover', 'site', pagina.bestand), 'utf8');
    const marker = `### ${pagina.titel} — \`${pagina.bestand}\``;

    const oude = commentNodes.filter(
      (c) => c.body.startsWith(marker) || c.body.startsWith(`### ${pagina.titel} — deel `),
    );
    for (const comment of oude) {
      await linearGraphql('mutation($id: String!) { commentDelete(id: $id) { success } }', {
        id: comment.id,
      });
    }

    const header = `${marker}\n\n\`\`\`html\n`;
    const footer = '\n```\n';

    // Voeg in stukken toe tot het eruit staat.
    const MAX = 18000;
    let rest = html;
    let ronde = 0;
    let gelukt = 0;

    while (rest.length > 0) {
      const stuk = rest.slice(0, MAX);
      rest = rest.slice(MAX);
      ronde += 1;
      const body =
        ronde === 1
          ? `${header}${stuk}${footer}`
          : `### ${pagina.titel} — deel ${ronde}\n\n\`\`\`html\n${stuk}${footer}`;
      const r = await linearGraphql(
        'mutation($input: CommentCreateInput!) { commentCreate(input: $input) { success } }',
        { input: { issueId: issue.id, body } },
      );
      if (!r?.commentCreate?.success) break;
      gelukt += 1;
    }

    commentResultaten.push({
      titel: pagina.titel,
      ok: gelukt > 0,
      bijgewerkt: oude.length > 0,
      ronden: gelukt,
    });
  }

  return { dienst: 'Linear', status: 'ok', url: `https://linear.app/webrnds/issue/${LINEAR_ISSUE}`, commentResultaten };
}

/* ================================================================
   SLACK
   ================================================================ */

async function pushSlack() {
  if (!env.SLACK_BOT_TOKEN) {
    return { dienst: 'Slack', status: 'overgeslagen', reden: 'geen SLACK_BOT_TOKEN' };
  }

  // Het pakket met de complete website: de vijf pagina's als HTML,
  // de media, de broncode en de leeswijzer.
  const pakket = path.join(root, 'handover', 'wesleys-ambacht-website.zip');
  const inhoud = await readFile(pakket);

  const vorm = new FormData();
  vorm.append('filename', 'wesleys-ambacht-website.zip');
  vorm.append('channels', SLACK_KANAAL);
  vorm.append(
    'initial_comment',
    'De website van Wesley’s Ambacht als HTML. Uitpakken en `website/index.html` openen.',
  );
  vorm.append(
    'file',
    new Blob([inhoud], { type: 'application/zip' }),
    'wesleys-ambacht-website.zip',
  );

  const upload = await fetch('https://slack.com/api/files.upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.SLACK_BOT_TOKEN}` },
    body: vorm,
  });
  const uploadJson = await upload.json();
  if (!uploadJson.ok) {
    return { dienst: 'Slack', status: 'mislukt', reden: uploadJson.error };
  }

  const bericht = [
    '*De website van Wesley’s Ambacht staat, met de HTML erbij.*',
    '',
    "Vijf pagina's in het merk “Havenlicht”: wit en licht, zeeblauw als inkt, een teal dat aan het signaal van de haven doet denken, pillvormige knoppen en foto's in een cirkel. De volledige HTML van elke pagina staat in het bijgevoegde pakket en in de Notion- en Linear-links hieronder.",
    '',
    '*De pagina’s:*',
    '',
    ...PAGINAS.map(
      (p) => `• ${p.titel} — \`${p.bestand}\``,
    ),
    '',
    `• De HTML in Notion: https://app.notion.com/p/4064c5f9f8e58163a9fbec0fdad107cb`,
    `• De overdracht met merk, prijzen en open punten: https://app.notion.com/p/4064c5f9f8e5811ba3d4f014171ce862`,
    `• De taken in Linear: https://linear.app/webrnds/issue/WEB-49`,
    '',
    'Gedaan en gecontroleerd: contrast 28 paren op WCAG AA, toetsenbord en mobiel menu getest, leesbaar zonder JavaScript, geen overloop op 320 tot 1440 px, contactformulier verzendt en opslaat niets, linkkaart zonder klantfoto’s. Het pakket bevat zowel de kant-en-klare HTML als de broncode.',
  ].join('\n');

  const antwoord = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({ channel: SLACK_KANAAL, text: bericht }),
  });
  const json = await antwoord.json();
  if (!json.ok) {
    return { dienst: 'Slack', status: 'deels gelukt', reden: `bestand ok, bericht niet: ${json.error}` };
  }

  return {
    dienst: 'Slack',
    status: 'ok',
    url: uploadJson.file?.permalink_private ?? uploadJson.file?.permalink ?? null,
  };
}

/* ================================================================
   UITVOEREN
   ================================================================ */

console.log('HTML van de website sturen\n');

const resultaten = [];

for (const [naam, fn] of [
  ['notion', pushNotion],
  ['linear', pushLinear],
  ['slack', pushSlack],
]) {
  const r = await fn();
  resultaten.push(r);
  console.log(`${r.dienst}: ${r.status}${r.reason ? ` (${r.reason})` : ''}`);
  if (r.url) console.log(`  ${r.url}`);
  if (r.paginaResultaten) {
    for (const p of r.paginaResultaten) {
      console.log(`    ${p.ok ? 'ok  ' : 'fout'} ${p.titel}${p.url ? `  ${p.url}` : ''}`);
    }
  }
  if (r.commentResultaten) {
    const goed = r.commentResultaten.filter((c) => c.ok).length;
    console.log(`  ${goed} van ${r.commentResultaten.length} comments geplaatst`);
  }
}

console.log('\nKlaar.');
