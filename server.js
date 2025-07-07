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
      const userAgent = req.get('User-Agent') || '';
      const isFacebookCrawler = userAgent.includes('facebookexternalhit') || userAgent.includes('facebookcatalog');
      
      console.log(`🌐 Request: ${url}`);
      console.log(`🤖 User-Agent: ${userAgent}`);
      console.log(`📘 Is Facebook Crawler: ${isFacebookCrawler}`);

      let template, render;

      template = fs.readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8');
      render = (await import('./dist/server/entry-server.js')).render;

<<<<<<< HEAD
      // Check if this is a product page for SEO
      let productSeo = null;
      const productMatch = url.match(/^\/products\/([^\/]+)$/);
      if (productMatch) {
        const slug = productMatch[1];
        console.log(`🔍 Fetching product for slug: ${slug}`);
        try {
          const apiUrl = `${process.env.VITE_BACKEND_URL || 'https://be-ecom-2hfk.onrender.com'}/api/v1/products/slug/${slug}`;
          console.log(`📡 API URL: ${apiUrl}`);
          const response = await axios.get(apiUrl);
          console.log(`📡 Response status: ${response.status}`);
          console.log(`📡 Response data:`, response.data);
          
          if (response && response.status === 200 && response.data && response.data.statusCode === 200) {
            productSeo = response.data.data;
            console.log(`✅ Product fetched successfully: ${productSeo.name}`);
          } else {
            console.log(`❌ Product not found or invalid response`, response.data);
          }
        } catch (error) {
          console.error('❌ Error fetching product for SEO:', error.message);
        }
      }
=======
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

>>>>>>> 6b85c0180c727af4632e4f4238230ffe33eacd23

      const { html: appHtml, helmetContext } = await render(url, productSeo);
      const { helmet } = helmetContext;

      // Generate comprehensive meta tags
      let metaTags = '';
      if (productSeo) {
        const slug = productMatch[1];
        const productTitle = (productSeo.meta_title || `${productSeo.name} | ECom Store`).replace(/"/g, '&quot;');
        const productDescription = (productSeo.meta_description || `Mua ${productSeo.name} với giá tốt nhất. ${productSeo.description || ''}`).slice(0, 160).replace(/"/g, '&quot;');
        const productImage = `${process.env.VITE_BACKEND_URL || 'https://be-ecom-2hfk.onrender.com'}${productSeo.image || '/images/placeholder.jpg'}`;
        const productUrl = `https://fe-eco.onrender.com/products/${slug}`;
        console.log(`🏷️ Generating meta tags for: ${productTitle}`);
        
        // For Facebook crawler, prioritize essential meta tags
        if (isFacebookCrawler) {
          console.log(`🤖 Optimizing for Facebook crawler`);
        }
        
        const jsonLd = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": productSeo.name,
          "image": [productImage],
          "description": (productSeo.description || '').replace(/"/g, ''),
          "sku": productSeo.sku || productSeo.id,
          "brand": {
            "@type": "Brand",
            "name": productSeo.brand || 'ECom Store'
          },
          "category": productSeo.category?.name || 'General',
          "offers": {
            "@type": "Offer",
            "url": productUrl,
            "priceCurrency": "VND",
            "price": productSeo.sale_price || productSeo.price,
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": (productSeo.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "name": "ECom Store"
            }
          }
        };
        
        metaTags = [
          `<title>${productTitle}</title>`,
          `<meta name="description" content="${productDescription}" />`,
          `<meta name="keywords" content="${(productSeo.meta_keywords || `${productSeo.name}, ${productSeo.category?.name || ''}, ${productSeo.brand || ''}, mua online`).toLowerCase().replace(/"/g, '&quot;')}" />`,
          `<link rel="canonical" href="${productUrl}" />`,
          `<meta property="og:type" content="product" />`,
          `<meta property="og:title" content="${productTitle}" />`,
          `<meta property="og:description" content="${productDescription}" />`,
          `<meta property="og:image" content="${productImage}" />`,
          `<meta property="og:image:width" content="800" />`,
          `<meta property="og:image:height" content="600" />`,
          `<meta property="og:url" content="${productUrl}" />`,
          `<meta property="og:site_name" content="ECom Store" />`,
          `<meta property="og:locale" content="vi_VN" />`,
          `<meta property="product:brand" content="${(productSeo.brand || 'ECom Store').replace(/"/g, '&quot;')}" />`,
          `<meta property="product:availability" content="${(productSeo.stock || 0) > 0 ? 'in stock' : 'out of stock'}" />`,
          `<meta property="product:condition" content="new" />`,
          `<meta property="product:price:amount" content="${productSeo.sale_price || productSeo.price}" />`,
          `<meta property="product:price:currency" content="VND" />`,
          `<meta property="product:retailer_item_id" content="${productSeo.id}" />`,
          `<meta property="product:category" content="${(productSeo.category?.name || 'General').replace(/"/g, '&quot;')}" />`,
          `<meta property="ia:markup_url" content="${productUrl}" />`,
          `<meta property="ia:markup_url_dev" content="${productUrl}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${productTitle}" />`,
          `<meta name="twitter:description" content="${productDescription}" />`,
          `<meta name="twitter:image" content="${productImage}" />`,
          `<meta name="robots" content="index, follow" />`,
          `<meta name="author" content="ECom Store" />`,
          `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
        ].join('\n        ');
        
        console.log(`📘 Meta tags generated successfully for Facebook`);
      }

      const head = helmet && helmet.title ? `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      ` : metaTags;

      const finalHtml = template
        .replace('<!--app-head-->', head)
        .replace('<!--app-html-->', appHtml)
        .replace('<!--ssr-meta-title-->', productMeta.title || '')
        .replace('<!--ssr-meta-description-->', productMeta.description || '')
        .replace('<!--ssr-meta-image-->', productMeta.image || '')
        .replace('<!--ssr-meta-url-->', productMeta.url || '');

      // Set appropriate headers for Facebook crawler
      const headers = {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': isFacebookCrawler ? 'public, max-age=300' : 'public, max-age=0, must-revalidate',
        'X-Robots-Tag': 'index, follow'
      };

      if (isFacebookCrawler) {
        headers['X-FB-Debug'] = 'true';
        console.log(`📘 Sending response to Facebook crawler with meta tags`);
      }

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
