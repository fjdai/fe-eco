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
      const userAgent = req.get('User-Agent') || '';
      const isFacebookCrawler = userAgent.includes('facebookexternalhit') || userAgent.includes('facebookcatalog');
      
      console.log(`🌐 Request: ${url}`);
      console.log(`🤖 User-Agent: ${userAgent}`);
      console.log(`📘 Is Facebook Crawler: ${isFacebookCrawler}`);

      let template, render;

      template = fs.readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
      render = (await import('./dist/server/entry-server.js')).render;

      let productMeta = {}
      if (url.startsWith('/product/')) {
        const slug = url.split('/product/')[1]
        const response = await fetch(`https://be-ecom-2hfk.onrender.com/api/products/slug/${slug}`)
        if(response?.statusCode === 200) {
          const product = response.data;
          productMeta = {
            title: product.meta_title,
            description: product.meta_description,
            image: `https://fe-ecom-2hfk.onrender.com/images/${product.image}`,
            url: `https://fe-ecom-2hfk.onrender.com/product/${product.slug}`
          };
        }
      }


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
          console.log('Product found:', JSON.stringify(product));
          console.log('Product meta title:', product.meta_title);
          console.log('Product meta description:', product.meta_description);
          console.log('Product image:', product.image[0]);
          console.log('Product slug:', product.slug);
          metaTags = `
            <title>${product.meta_title}</title>
            <meta property="og:title" content="${product.meta_title}">
            <meta property="og:description" content="${product.meta_description}">
            <meta property="og:image" content="https://be-ecom-2hfk.onrender.com/images/${product.image[0]}">
            <meta property="og:url" content="https://fe-ecom-2hfk.onrender.com/product/${product.slug}">
          `;
        }
      }

      const { html: appHtml } = await render(url);

      const finalHtml = template
        .replace('<!--ssr-meta-->', metaTags)
        .replace('<!--app-html-->', appHtml);

      res.status(200).set(headers).end(finalHtml);
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
