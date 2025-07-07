import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';
import sirv from 'sirv';
import fs from 'fs';
import { Logger } from 'sass';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = true;

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
    app.use(sirv(resolve(__dirname, 'dist/client'), { gzip: true, extensions: [] }));
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;

      template = fs.readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
      render = (await import('./dist/server/entry-server.js')).render;

      // Check if this is a product page for SEO
      let productSeo = null;
      const productMatch = url.match(/^\/products\/([^\/]+)$/);
      if (productMatch) {
        const slug = productMatch[1];
        try {
          const response = await axios.get(`${process.env.VITE_BACKEND_URL || 'https://be-ecom-2hfk.onrender.com'}/api/v1/products/slug/${slug}`);
          if (response && response.statusCode === 200) {
            productSeo = response.data;
          }
        } catch (error) {
          console.error('Error fetching product for SEO:', error.message);
        }
      }

      const { html: appHtml, helmetContext } = await render(url, productSeo);
      const { helmet } = helmetContext;

      const head = helmet ? `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      ` : '';

      const finalHtml = template
        .replace('<!--app-head-->', head)
        .replace('<!--app-html-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
      if (!isProduction) vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.stack);
    }
  });

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

createServer();
