# Facebook SEO Setup for ECom Store

## Overview
This guide helps you set up optimal Facebook SEO for your e-commerce store to ensure proper sharing and Open Graph integration.

## Features Implemented

### 1. Complete Open Graph Meta Tags
- **og:type**: Set to "product" for product pages, "website" for homepage
- **og:title**: Dynamic product title or site title  
- **og:description**: SEO-optimized descriptions
- **og:image**: High-quality product images (800x600 minimum)
- **og:url**: Canonical URLs for each page
- **og:site_name**: "ECom Store"
- **og:locale**: "vi_VN" for Vietnamese content

### 2. Facebook Product-Specific Tags
- **product:brand**: Product brand information
- **product:availability**: Stock status ("in stock" or "out of stock")
- **product:condition**: Always "new" for retail products
- **product:price:amount**: Product price
- **product:price:currency**: "VND" for Vietnamese Dong
- **product:retailer_item_id**: Unique product ID
- **product:category**: Product category

### 3. Facebook Commerce Tags
- **ia:markup_url**: For Instant Articles
- **ia:markup_url_dev**: Development version
- **fb:app_id**: Facebook App ID (to be configured)

### 4. Schema.org Structured Data
Complete JSON-LD markup for products including:
- Product information
- Pricing and availability
- Brand and category
- Seller information
- Ratings and reviews (when available)

## Setup Instructions

### Step 1: Configure Facebook App ID
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Get your App ID
4. Replace `YOUR_FB_APP_ID` in `index.html` with your actual App ID

### Step 2: Test Facebook Sharing
1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your product URLs
3. Check if all meta tags are detected properly
4. Use "Scrape Again" if needed to refresh cache

### Step 3: Optimize Product Images
- Ensure product images are at least 800x600 pixels
- Use high-quality, clear product photos
- Images should be accessible via HTTPS
- Consider using Open Graph specific images (1200x630 for better display)

### Step 4: Test on Different Devices
- Test sharing on mobile Facebook app
- Test on desktop Facebook
- Check Instagram sharing (uses same Open Graph tags)
- Verify WhatsApp previews work correctly

## Current Implementation

### Server-Side Rendering (SSR)
- Product data is fetched server-side for immediate SEO
- Meta tags are rendered before client-side JavaScript
- No hydration mismatches with proper meta tag handling

### Dynamic Meta Tags
- Product-specific titles and descriptions
- Dynamic pricing information
- Stock status updates
- Category and brand information

### Image Optimization
- Product images are properly formatted for sharing
- Fallback to placeholder images when needed
- Full image URLs with domain included

## Testing Checklist

- [ ] Product pages have complete Open Graph tags
- [ ] Images display correctly in Facebook previews
- [ ] Product information is accurate
- [ ] Pricing and availability are correct
- [ ] Schema.org markup validates
- [ ] Facebook App ID is configured
- [ ] All URLs are accessible and canonical

## Troubleshooting

### Common Issues:
1. **Images not showing**: Check image URLs are absolute and HTTPS
2. **Wrong title/description**: Clear Facebook cache using Sharing Debugger
3. **Product info missing**: Verify server-side rendering is working
4. **Hydration errors**: Check client-side rendering matches server-side

### Facebook Cache Issues:
- Use Facebook Sharing Debugger to force refresh
- Add `?v=timestamp` to URLs to bypass cache
- Wait 24 hours for automatic cache refresh

## Performance Optimization

### Image Loading
- Use optimized image formats (WebP when possible)
- Implement lazy loading for non-critical images
- Use appropriate image sizes for different use cases

### SEO Performance
- Critical meta tags are rendered server-side
- Non-critical content loads asynchronously
- Fast Time to First Byte (TTFB) for better sharing
- `og:image` - Hình ảnh sản phẩm
- `og:url` - URL canonical
- `og:type` - Product type
- `og:site_name` - Tên website
- `og:locale` - Ngôn ngữ (vi_VN)

### 2. Facebook Product Tags
- `product:brand` - Thương hiệu
- `product:availability` - Tình trạng kho
- `product:condition` - Tình trạng sản phẩm
- `product:price:amount` - Giá
- `product:price:currency` - Đơn vị tiền tệ
- `product:retailer_item_id` - ID sản phẩm
- `product:category` - Danh mục

### 3. Schema.org Structured Data
- Product schema với đầy đủ thông tin
- AggregateRating cho đánh giá
- Offer với giá và tình trạng
- Brand information

### 4. Twitter Cards
- Large image summary card
- Product information for Twitter

## Testing SEO

### 1. Facebook Debugger
- Kiểm tra tại: https://developers.facebook.com/tools/debug/
- Paste URL sản phẩm để kiểm tra Open Graph tags

### 2. Google Rich Results Test
- Kiểm tra tại: https://search.google.com/test/rich-results
- Paste URL để kiểm tra structured data

### 3. Twitter Card Validator
- Kiểm tra tại: https://cards-dev.twitter.com/validator
- Paste URL để kiểm tra Twitter card

## Troubleshooting

### Common Issues:
1. **Facebook cache**: Dùng Facebook Debugger để scrape lại
2. **Images not loading**: Đảm bảo image URLs là absolute URLs
3. **Missing meta tags**: Kiểm tra server-side rendering

### React Hydration Error Fix:
- Đã sửa `entry-client.tsx` để sử dụng `createRoot` thay vì `hydrateRoot`
- Tránh hydration mismatch giữa server và client

## Next Steps

1. Thay thế tất cả placeholder IDs bằng IDs thực tế
2. Upload hình ảnh OG mặc định (1200x630px)
3. Test trên Facebook Debugger
4. Cấu hình Facebook Analytics
5. Setup Facebook Conversions API cho tracking tốt hơn
