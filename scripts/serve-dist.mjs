// Kleine statische server voor de gebouwde site in dist/.
// Gebruik: node scripts/serve-dist.mjs [poort]
// Accepteert elke Host, zodat een tunnel (trycloudflare) de site kan bereiken.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL("..", import.meta.url));
const root = join(here, "dist");
const port = Number(process.argv[2] || 4330);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function resolve(pathname) {
  const segments = decodeURIComponent(pathname).split("/").filter((part) => part && part !== "..");
  const target = join(root, ...segments);
  if (!target.startsWith(root)) return null;
  if (!existsSync(target)) return null;
  const stats = statSync(target);
  if (stats.isDirectory()) {
    const index = join(target, "index.html");
    return existsSync(index) ? index : null;
  }
  return target;
}

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const file = resolve(url.pathname);
  if (file) {
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    createReadStream(file).pipe(res);
    return;
  }
  const notFound = join(root, "404.html");
  if (existsSync(notFound)) {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    createReadStream(notFound).pipe(res);
    return;
  }
  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Niet gevonden");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`De site draait op http://127.0.0.1:${port}/`);
});
