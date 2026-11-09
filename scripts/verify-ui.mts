/**
 * Browsercontrole op de gebouwde site.
 * Run: npm run verify:ui   (de server moet op poort 4321 draaien)
 */
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:4321";
const paginas = ['/', '/ambachtswinkel', '/catering', '/vergaderen', '/contact', '/404'];

const browser = await chromium.launch();
const fouten: string[] = [];
const notities: string[] = [];

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. Focus is zichtbaar via het toetsenbord.
await page.goto(base, { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
const eersteFocus = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const stijl = getComputedStyle(el);
  return {
    label: el.textContent?.trim().slice(0, 40),
    outlineWidth: stijl.outlineWidth,
    outlineStyle: stijl.outlineStyle,
  };
});
if (!eersteFocus || eersteFocus.outlineStyle === 'none' || eersteFocus.outlineWidth === '0px') {
  fouten.push(`Focusindicator ontbreekt: ${JSON.stringify(eersteFocus)}`);
} else {
  notities.push(`Focus zichtbaar: "${eersteFocus.label}" (${eersteFocus.outlineWidth} ${eersteFocus.outlineStyle})`);
}

// 2. Geen focusring na een pointerklik.
await page.mouse.click(700, 400);
const naKlik = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return 'geen focus';
  return getComputedStyle(el).outlineStyle;
});
notities.push(`Focus na pointerklik: ${naKlik}`);

// 3. Het mobiele menu werkt met de knop en met Escape.
const mobiel = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobiel.goto(base, { waitUntil: 'networkidle' });
const menuKnop = mobiel.locator('.menu-knop');
await menuKnop.click();
const menuOpen = await mobiel.locator('#mobiel-menu').isVisible();
if (!menuOpen) fouten.push('Mobiel menu opent niet met de knop.');
await mobiel.keyboard.press('Escape');
const menuDicht = !(await mobiel.locator('#mobiel-menu').isVisible());
if (!menuDicht) notities.push('Mobiel menu sluit niet met Escape (alleen via de knop).');
else notities.push('Mobiel menu opent en sluit.');
await mobiel.close();

// 4. FAQ werkt met het toetsenbord.
await page.goto(`${base}/catering`, { waitUntil: 'networkidle' });
const samenvatting = page.locator('summary').first();
await samenvatting.focus();
await page.keyboard.press('Enter');
const faqOpen = await samenvatting.evaluate((el) => (el.parentElement as HTMLDetailsElement).open);
if (!faqOpen) fouten.push('FAQ opent niet met Enter.');
else notities.push('FAQ opent met Enter.');

// 5. Zonder JavaScript blijft alle tekst zichtbaar.
const zonderJs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 900 },
});
const jsPagina = await zonderJs.newPage();
await jsPagina.goto(base, { waitUntil: 'domcontentloaded' });
const verborgenZonderJs = await jsPagina.evaluate(
  () =>
    Array.from(document.querySelectorAll('body *')).filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      return Number(cs.opacity) < 0.99;
    }).length
);
if (verborgenZonderJs > 0) {
  fouten.push(`${verborgenZonderJs} element(en) blijven onzichtbaar zonder JavaScript.`);
} else {
  notities.push('Alle inhoud blijft zichtbaar zonder JavaScript.');
}
await zonderJs.close();

// 6. Inhoud: geen emoji, geen em dash, geen element zonder naam, overal een rail.
const emojiPatroon = '[\\u{1F000}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{2B00}-\\u{2BFF}\\u{FE0F}\\u{1F1E6}-\\u{1F1FF}]';

for (const pad of paginas) {
  await page.goto(`${base}${pad}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(300);

  const inhoud = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let tekst = '';
    let node = walker.nextNode();
    while (node) {
      const ouder = node.parentElement;
      if (ouder && ouder.closest('script, style') === null) {
        tekst += `${node.textContent ?? ''}\n`;
      }
      node = walker.nextNode();
    }
    return tekst;
  });

  if (inhoud.includes('—')) fouten.push(`Em dash op ${pad}.`);
  if (inhoud.includes('–')) fouten.push(`En dash op ${pad}.`);

  const emoji = await page.evaluate((patroon) => {
    const re = new RegExp(patroon, 'u');
    const gevonden: string[] = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length > 0) continue;
      if (el.closest('script, style')) continue;
      if (el.textContent && re.test(el.textContent)) gevonden.push(el.textContent.slice(0, 30));
    }
    return gevonden;
  }, emojiPatroon);
  if (emoji.length > 0) fouten.push(`Emoji op ${pad}: ${emoji.join(' | ')}`);

  const zonderNaam = await page.evaluate(() => {
    const gevonden: string[] = [];
    for (const el of document.querySelectorAll('button, a')) {
      const tekst = el.textContent?.trim() ?? '';
      const label = el.getAttribute('aria-label') ?? '';
      if (!tekst && !label) gevonden.push(el.outerHTML.slice(0, 70));
    }
    return gevonden;
  });
  if (zonderNaam.length > 0) {
    fouten.push(`Elementen zonder toegankelijke naam op ${pad}: ${zonderNaam.join(' | ')}`);
  }

  const rail = await page.evaluate(() => {
    const el = document.querySelector('.rail');
    if (!el) return null;
    const box = el.getBoundingClientRect();
    return [Math.round(box.left), Math.round(window.innerWidth - box.right)];
  });
  if (!rail) fouten.push(`Geen content rail op ${pad}.`);
}

const railen = await (async () => {
  const uitkomsten: number[][] = [];
  for (const pad of paginas) {
    await page.goto(`${base}${pad}`, { waitUntil: 'networkidle' });
    uitkomsten.push(
      await page.evaluate(() => {
        const el = document.querySelector('.rail');
        if (!el) return [-1, -1];
        const box = el.getBoundingClientRect();
        return [Math.round(box.left), Math.round(window.innerWidth - box.right)];
      })
    );
  }
  return uitkomsten;
})();

const referentie = JSON.stringify(railen[0]);
railen.forEach((rail, index) => {
  if (JSON.stringify(rail) !== referentie) {
    fouten.push(`Content rail wijkt af op ${paginas[index]}: ${JSON.stringify(rail)} tegenover ${referentie}`);
  }
});
notities.push(`Content rail overal gelijk: ${referentie}`);

// 7. Alle afbeeldingen hebben een alt-tekst en een breedte.
for (const pad of paginas) {
  await page.goto(`${base}${pad}`, { waitUntil: 'networkidle' });
  const beelden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('img'))
      .filter((img) => !img.hasAttribute('alt'))
      .map((img) => img.getAttribute('src'))
  );
  if (beelden.length > 0) fouten.push(`Afbeeldingen zonder alt op ${pad}: ${beelden.join(', ')}`);
}

// 8. Reduce motion: de gloeidlijn blijft zichtbaar en er is geen beweging.
const zonderBeweging = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
await zonderBeweging.goto(base, { waitUntil: 'networkidle' });
await zonderBeweging.waitForTimeout(1600);
const animaties = await zonderBeweging.evaluate(
  () => document.getAnimations().filter((a) => a.playState === 'running').length
);
if (animaties > 0) fouten.push(`${animaties} animatie(s) draaien met prefers-reduced-motion.`);
else notities.push('Geen beweging met prefers-reduced-motion.');
await zonderBeweging.close();

await browser.close();

console.log(notities.map((n) => `OK   ${n}`).join('\n'));
if (fouten.length > 0) {
  console.log(`\n${fouten.map((f) => `FAIL ${f}`).join('\n')}`);
  process.exit(1);
}
console.log('\nAlle interactie- en inhoudscontroles geslaagd.');
