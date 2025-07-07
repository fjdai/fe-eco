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
          if (response && response.data && response.data.statusCode === 200) {
            productSeo = response.data.data;
          }
        } catch (error) {
          console.error('Error fetching product for SEO:', error.message);
        }
      }

      const { html: appHtml, helmetContext } = await render(url, productSeo);
      const { helmet } = helmetContext;

      // Generate comprehensive meta tags
      let metaTags = '';
      if (productSeo) {
        const productTitle = productSeo.meta_title || `${productSeo.name} | ECom Store`;
        const productDescription = productSeo.meta_description || `Mua ${productSeo.name} với giá tốt nhất. ${productSeo.description || ''}`.slice(0, 160);
        const productImage = `${process.env.VITE_BACKEND_URL || 'https://be-ecom-2hfk.onrender.com'}${productSeo.image || '/images/placeholder.jpg'}`;
        const productUrl = `https://fe-eco.onrender.com/products/${slug}`;
        
        metaTags = `
          <title>${productTitle}</title>
          <meta name="description" content="${productDescription}" />
          <meta name="keywords" content="${productSeo.meta_keywords || `${productSeo.name}, ${productSeo.category?.name || ''}, ${productSeo.brand || ''}, mua online`.toLowerCase()}" />
          <link rel="canonical" href="${productUrl}" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="product" />
          <meta property="og:title" content="${productTitle}" />
          <meta property="og:description" content="${productDescription}" />
          <meta property="og:image" content="${productImage}" />
          <meta property="og:image:width" content="800" />
          <meta property="og:image:height" content="600" />
          <meta property="og:url" content="${productUrl}" />
          <meta property="og:site_name" content="ECom Store" />
          <meta property="og:locale" content="vi_VN" />
          
          <!-- Facebook Product specific -->
          <meta property="product:brand" content="${productSeo.brand || 'ECom Store'}" />
          <meta property="product:availability" content="${(productSeo.stock || 0) > 0 ? 'in stock' : 'out of stock'}" />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content="${productSeo.sale_price || productSeo.price}" />
          <meta property="product:price:currency" content="VND" />
          <meta property="product:retailer_item_id" content="${productSeo.id}" />
          <meta property="product:category" content="${productSeo.category?.name || 'General'}" />
          
          <!-- Additional Facebook Commerce -->
          <meta property="ia:markup_url" content="${productUrl}" />
          <meta property="ia:markup_url_dev" content="${productUrl}" />
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${productTitle}" />
          <meta name="twitter:description" content="${productDescription}" />
          <meta name="twitter:image" content="${productImage}" />
          
          <!-- Additional SEO -->
          <meta name="robots" content="index, follow" />
          <meta name="author" content="ECom Store" />
          <meta name="revisit-after" content="7 days" />
          <meta name="rating" content="general" />
          <meta name="distribution" content="global" />
          
          <!-- Schema.org JSON-LD -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "${productSeo.name}",
            "image": ["${productImage}"],
            "description": "${productSeo.description || ''}",
            "sku": "${productSeo.sku || productSeo.id}",
            "brand": {
              "@type": "Brand",
              "name": "${productSeo.brand || 'ECom Store'}"
            },
            "category": "${productSeo.category?.name || 'General'}",
            "offers": {
              "@type": "Offer",
              "url": "${productUrl}",
              "priceCurrency": "VND",
              "price": "${productSeo.sale_price || productSeo.price}",
              "priceValidUntil": "${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}",
              "availability": "${(productSeo.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "ECom Store"
              }
            }
          }
          </script>
        `;
      }

      const head = helmet && helmet.title ? `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      ` : metaTags;

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
