// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Standaard is dit het eigen domein. Bij een preview-deploy op GitHub
// Pages worden deze waarden overschreven via env vars.
//
// Let op: DEPLOY_BASE bevat het pad zonder voorloopende slash. Een waarde
// als "/wesleys-ambacht-site" wordt door Git Bash op Windows als
// systeempad omgezet.
const site = process.env.SITE_URL ?? 'https://ambachtbijwesley.nl';
const deployBase = process.env.DEPLOY_BASE?.trim();
const base = deployBase ? `/${deployBase.replace(/^\/+|\/+$/g, '')}` : '/';

export default defineConfig({
  site,
  base,
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.loca.lt',
        '.ngrok.io',
        '.trycloudflare.com',
      ],
      host: '0.0.0.0',
    },
    // Zelfde lijst voor de preview-server, zodat een tunnel de site
    // kan bereiken.
    preview: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.loca.lt',
        '.ngrok.io',
        '.trycloudflare.com',
      ],
    },
  },
});
