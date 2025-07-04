import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';
import sirv from 'sirv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

const BOTS = [
  'facebookexternalhit',
  'Facebot',
  'LinkedInBot',
  'Twitterbot',
  'WhatsApp',
];

function isBot(userAgent) {
  if (!userAgent) return false;
  return BOTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

async function createServer() {
  const app = express();
  app.use(compression());

  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    app.use(sirv('dist/client', { gzip: true }));
  }

  // Cache for bot requests
  const botCache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const userAgent = req.headers['user-agent'];
      const isWebCrawler = isBot(userAgent);

      // Check cache for bots
      if (isWebCrawler) {
        const cachedResponse = botCache.get(url);
        if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_DURATION) {
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(cachedResponse.html);
        }
      }

      let template, render;

      if (!isProduction) {
        template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = fs.readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      // Increase timeout for bots
      if (isWebCrawler) {
        res.setTimeout(30000); // 30 seconds timeout for bots
      }

      const { html: appHtml, helmetContext } = await render(url);
      
      // Extract helmet data
      const { helmet } = helmetContext;
      
      if (!helmet) {
        console.warn('No helmet context found');
      }

      // Construct head content with meta tags
      const head = helmet ? `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      ` : '';

      // Insert meta tags and content
      const finalHtml = template
        .replace('<!--app-head-->', head)
        .replace('<!--app-html-->', appHtml);

      // Cache response for bots
      if (isWebCrawler) {
        botCache.set(url, {
          html: finalHtml,
          timestamp: Date.now()
        });
// Log bot access
        console.log(`Bot access: ${userAgent} - ${url}`);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
      if (!isProduction) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      res.status(500).end(e.stack);
    }
  });

  const port = process.env.PORT || 3001;
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying port ${port + 1}...`);
      server.close();
      app.listen(port + 1, () => {
        console.log(`Server running at http://localhost:${port + 1}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

createServer();