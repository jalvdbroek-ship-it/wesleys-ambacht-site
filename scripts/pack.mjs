/**
 * Pakt de website in een zip die je ergens anders kunt gebruiken.
 *
 * Run: node scripts/pack.mjs
 *
 * Het pakket bevat twee delen:
 *
 *   website/   de vijf pagina's plus de 404 als zelfstandige HTML,
 *              met de CSS inline. Open website/index.html en de site
 *              werkt, zonder installatie en zonder internet.
 *   bron/      de volledige broncode (Astro, Tailwind, TypeScript),
 *              zodat de site opnieuw gebouwd kan worden:
 *              cd bron && npm install && npm run build
 *
 * Daarnaast staan public/ (afbeeldingen en brochures), het ontwerpdocument
 * en de README in het pakket.
 */
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const zip = path.join(root, 'handover', 'wesleys-ambacht-website.zip');

const bestanden = [
  'src',
  'public',
  'scripts',
  'astro.config.mjs',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'DESIGN.md',
  'README.md',
  '.gitignore',
];

// String.raw zodat de backslashes in de paden intact blijven.
const commando = String.raw`
$root = "${root}"
$werk = Join-Path $env:TEMP "webrnds-herbruikbaar"
if (Test-Path $werk) { Remove-Item $werk -Recurse -Force }
New-Item -ItemType Directory -Force -Path (Join-Path $werk "website") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $werk "bron") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $werk "website\media") | Out-Null

# De kant-en-klare HTML.
Copy-Item (Join-Path $root "handover\site\*.html") (Join-Path $werk "website")

# De media naast de HTML, zodat alles lokaal blijft.
Copy-Item (Join-Path $root "public\images") (Join-Path $werk "website\media\images") -Recurse
Copy-Item (Join-Path $root "public\brochures") (Join-Path $werk "website\media\brochures") -Recurse
Copy-Item (Join-Path $root "public\favicon.png") (Join-Path $werk "website\media") -ErrorAction SilentlyContinue
Copy-Item (Join-Path $root "public\apple-touch-icon.png") (Join-Path $werk "website\media") -ErrorAction SilentlyContinue

# De paden in de HTML wijzen nu naar de map media naast de bestanden.
Get-ChildItem (Join-Path $werk "website\*.html") | ForEach-Object {
  $inhoud = Get-Content $_.FullName -Raw -Encoding UTF8
  $inhoud = $inhoud.Replace("../../public/images", "media/images")
  $inhoud = $inhoud.Replace("../../public/brochures", "media/brochures")
  $inhoud = $inhoud.Replace("../../public/favicon.png", "media/favicon.png")
  $inhoud = $inhoud.Replace("../../public/apple-touch-icon.png", "media/apple-touch-icon.png")
  Set-Content $_.FullName $inhoud -Encoding UTF8 -NoNewline
}

# De broncode.
${bestanden
  .map(
    (bestand) =>
      `Copy-Item (Join-Path $root "${bestand}") (Join-Path $werk "bron") -Recurse -Force -ErrorAction SilentlyContinue`,
  )
  .join('\n')}

# De leeswijzer voor wie het pakket uitpakt.
Copy-Item (Join-Path $root "handover\LEES-MIJ-ERBIJ.txt") $werk

$zip = "${zip}"
if (Test-Path $zip) { Remove-Item $zip -Force }
# Get-ChildItem i.p.v. een wildcard: anders laat Compress-Archive de
# bestanden op de hoogste niveau liggen.
Get-ChildItem -Path $werk | Compress-Archive -DestinationPath $zip -CompressionLevel Optimal
Remove-Item $werk -Recurse -Force
`;

execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', commando], {
  stdio: 'inherit',
});

if (!statSync(zip).size) {
  console.error('Het pakket is niet aangemaakt.');
  process.exit(1);
}

console.log(`Pakket: ${zip}`);
console.log(`Grootte: ${(statSync(zip).size / 1024 / 1024).toFixed(1)} MB`);
