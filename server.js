import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';
import sirv from 'sirv';
import fs from 'fs';

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

      if (!isProduction) {
        template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = fs.readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      // 👉 Nếu là product page, fetch product data
      let product = null;
      if (url.startsWith('/product/')) {
        const slug = url.split('/product/')[1]
        const productRes = await fetch(`https://be-ecom-2hfk.onrender.com/api/v1/products/${slug}`);
        if (productRes.ok) {
          product = await productRes.json();  
        }
      }

      // 👉 Pass product vào render
      const { html: appHtml, helmetContext } = await render(url, product);
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
