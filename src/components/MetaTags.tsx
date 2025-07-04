import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  price?: number;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  structuredData?: object;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'ECom - Cửa hàng điện tử trực tuyến',
  description = 'Mua sắm trực tuyến với giá tốt nhất tại ECom',
  keywords = 'ecommerce, shopping, điện tử, mua online',
  image = '/images/default-og-image.jpg',
  url = '',
  type = 'website',
  siteName = 'ECom',
  locale = 'vi_VN',
  price,
  currency = 'USD',
  availability,
  brand,
  category,
  sku,
  structuredData
}) => {
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ECom" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Product Specific Meta Tags */}
      {type === 'product' && (
        <>
          {price && <meta property="product:price:amount" content={String(price)} />}
          {currency && <meta property="product:price:currency" content={currency} />}
          {availability && <meta property="product:availability" content={availability} />}
          {brand && <meta property="product:brand" content={brand} />}
          {category && <meta property="product:category" content={category} />}
          <meta property="product:condition" content="new" />
          {sku && <meta property="product:retailer_item_id" content={sku} />}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:site" content="@ecom_vn" />
      <meta name="twitter:creator" content="@ecom_vn" />
      
      {/* Additional Meta Tags */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
