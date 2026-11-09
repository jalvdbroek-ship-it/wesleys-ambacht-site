// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ambachtbijwesley.nl',
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
