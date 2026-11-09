/**
 * Contrastaudit voor het palet van Wesley's Ambacht.
 * Run: npm run contrast
 *
 * De verhoudingen worden berekend uit de opgeloste sRGB-waarden,
 * niet geschat. De norm is WCAG 2.2 AA.
 */

/** OKLCH naar lineair sRGB, met chroma-reductie als de kleur buiten gamut ligt. */
function oklabToLinearSrgb(l: number, a: number, b: number) {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const lc = l_ ** 3;
  const mc = m_ ** 3;
  const sc = s_ ** 3;
  return {
    r: 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    g: -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    b: -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  };
}

const inGamut = (rgb: { r: number; g: number; b: number }) => {
  const eps = 1e-4;
  return (
    rgb.r >= -eps && rgb.r <= 1 + eps &&
    rgb.g >= -eps && rgb.g <= 1 + eps &&
    rgb.b >= -eps && rgb.b <= 1 + eps
  );
};

const clamp = (rgb: { r: number; g: number; b: number }) => ({
  r: Math.min(1, Math.max(0, rgb.r)),
  g: Math.min(1, Math.max(0, rgb.g)),
  b: Math.min(1, Math.max(0, rgb.b)),
});

function oklchToLinearRgb(l: number, c: number, h: number) {
  const rad = (h * Math.PI) / 180;
  const direct = oklabToLinearSrgb(l, c * Math.cos(rad), c * Math.sin(rad));
  if (inGamut(direct)) return clamp(direct);

  let low = 0;
  let high = c;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    const candidate = oklabToLinearSrgb(l, mid * Math.cos(rad), mid * Math.sin(rad));
    if (inGamut(candidate)) low = mid;
    else high = mid;
  }
  return clamp(oklabToLinearSrgb(l, low * Math.cos(rad), low * Math.sin(rad)));
}

function relativeLuminance(kleur: readonly number[]) {
  const rgb = oklchToLinearRgb(kleur[0], kleur[1], kleur[2]);
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function contrastRatio(a: readonly number[], b: readonly number[]): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** De kleurwaarden uit src/styles/global.css, in OKLCH. */
const palet = {
  haven: [0.3, 0.055, 245],
  'haven-donker': [0.21, 0.045, 250],
  'haven-mist': [0.955, 0.014, 225],
  ink: [0.3, 0.05, 245],
  'ink-mist': [0.52, 0.03, 240],
  signaal: [0.5, 0.085, 200],
  'signaal-donker': [0.42, 0.08, 202],
  'signaal-licht': [0.78, 0.075, 195],
  'wit-mist': [0.92, 0.012, 230],
  schuim: [0.968, 0.009, 225],
  wit: [1, 0, 0],
  lijn: [0.895, 0.012, 235],
  'lijn-invoer': [0.62, 0.022, 235],
  vuurtoren: [0.62, 0.13, 65],
} as const;

type PaletKey = keyof typeof palet;

const paren: { fg: PaletKey; bg: PaletKey; min: number; label: string }[] = [
  { fg: 'ink', bg: 'wit', min: 4.5, label: 'Bodytekst op wit' },
  { fg: 'ink', bg: 'schuim', min: 4.5, label: 'Bodytekst op een lichte band' },
  { fg: 'ink', bg: 'haven-mist', min: 4.5, label: 'Bodytekst op het koele paneel' },
  { fg: 'ink-mist', bg: 'wit', min: 4.5, label: 'Inleiding op wit' },
  { fg: 'ink-mist', bg: 'schuim', min: 4.5, label: 'Inleiding op een lichte band' },
  { fg: 'ink-mist', bg: 'haven-mist', min: 4.5, label: 'Inleiding op het koele paneel' },
  { fg: 'haven', bg: 'wit', min: 4.5, label: 'Koppen op wit' },
  { fg: 'haven', bg: 'schuim', min: 4.5, label: 'Koppen op een lichte band' },
  { fg: 'signaal', bg: 'wit', min: 4.5, label: 'Signaal op wit' },
  { fg: 'signaal', bg: 'schuim', min: 4.5, label: 'Signaal op een lichte band' },
  { fg: 'signaal', bg: 'haven-mist', min: 4.5, label: 'Signaal op het koele paneel' },
  { fg: 'signaal-donker', bg: 'wit', min: 4.5, label: 'Signaal bij hover op wit' },
  { fg: 'wit', bg: 'haven', min: 4.5, label: 'Knoptekst op zeeblauw' },
  { fg: 'wit', bg: 'haven-donker', min: 4.5, label: 'Knoptekst op zeeblauw bij hover' },
  { fg: 'wit', bg: 'signaal', min: 4.5, label: 'Knoptekst op het signaal' },
  { fg: 'wit', bg: 'signaal-donker', min: 4.5, label: 'Knoptekst op het signaal bij hover' },
  { fg: 'wit-mist', bg: 'haven', min: 4.5, label: 'Inleiding op de donkere band' },
  { fg: 'signaal-licht', bg: 'haven', min: 4.5, label: 'Signaal op de donkere band' },
  { fg: 'signaal-licht', bg: 'haven-donker', min: 4.5, label: 'Signaal op het voetstuk' },
];

const randen: { kleur: PaletKey; bg: PaletKey; label: string }[] = [
  { kleur: 'lijn-invoer', bg: 'wit', label: 'Rand van een invoerveld op wit' },
  { kleur: 'lijn-invoer', bg: 'schuim', label: 'Rand van een invoerveld op een lichte band' },
  { kleur: 'signaal', bg: 'wit', label: 'Ring van de haven op wit' },
  { kleur: 'haven', bg: 'wit', label: 'Focusindicator op wit' },
  { kleur: 'signaal-licht', bg: 'haven', label: 'Focusindicator op de donkere band' },
  { kleur: 'vuurtoren', bg: 'wit', label: 'Sterretjes op wit' },
  { kleur: 'lijn', bg: 'schuim', label: 'Haarlijn tussen kaarten (niet verplicht)' },
];

let fouten = 0;
const regels: string[] = [];

for (const paar of paren) {
  const ratio = contrastRatio(palet[paar.fg], palet[paar.bg]);
  const ok = ratio >= paar.min;
  if (!ok) fouten += 1;
  regels.push(
    [
      ok ? 'PASS' : 'FAIL',
      `${paar.fg} op ${paar.bg}`.padEnd(26),
      `${ratio.toFixed(2)}:1`.padStart(7),
      `min ${paar.min}:1`,
      paar.label,
    ].join('  '),
  );
}

for (const rand of randen) {
  const ratio = contrastRatio(palet[rand.kleur], palet[rand.bg]);
  const verplicht = !rand.label.includes('niet verplicht');
  const ok = ratio >= 3;
  if (!ok && verplicht) fouten += 1;
  regels.push(
    [
      ok ? 'PASS' : verplicht ? 'FAIL' : 'INFO',
      `${rand.kleur} op ${rand.bg}`.padEnd(26),
      `${ratio.toFixed(2)}:1`.padStart(7),
      'min 3:1',
      rand.label,
    ].join('  '),
  );
}

console.log("Wesley's Ambacht — contrastaudit\n");
console.log(regels.join('\n'));
console.log(
  fouten === 0
    ? '\nAlle paren halen WCAG 2.2 AA.'
    : `\n${fouten} paar(en) halen de norm niet.`,
);
process.exit(fouten === 0 ? 0 : 1);
