import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';
import sirv from 'sirv';
import fs from 'fs';
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

      let metaTags = `
        <title>ECommerce Site</title>
        <meta property="og:title" content="ECommerce Site">
        <meta property="og:description" content="Best online store.">
        <meta property="og:image" content="https://fe-ecom-2hfk.onrender.com/images/default.jpg">
        <meta property="og:url" content="https://fe-ecom-2hfk.onrender.com${url}">
      `;

      if (url.startsWith('/products/')) {
        const slug = url.split('/products/')[1];
        const response = await axios.get(`https://be-ecom-2hfk.onrender.com/api/v1/products/slug/${slug}`);
        const product = response?.data;
        if (product) {
          metaTags = `
            <title>${product.meta_title}</title>
            <meta property="og:title" content="${product.meta_title}">
            <meta property="og:description" content="${product.meta_description}">
            <meta property="og:image" content="https://be-ecom-2hfk.onrender.com/images/${product.image}">
            <meta property="og:url" content="https://fe-ecom-2hfk.onrender.com/product/${product.slug}">
          `;
        }
      }

      const { html: appHtml } = await render(url);

      const finalHtml = template
        .replace('<!--ssr-meta-->', metaTags)
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
