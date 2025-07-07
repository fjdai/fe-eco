# Facebook SEO Test Script

## Cách test Facebook sharing:

### 1. Test với Facebook Sharing Debugger
```
URL: https://developers.facebook.com/tools/debug/
Nhập: https://fe-eco.onrender.com/products/airpods-pro
```

### 2. Test với curl command:
```bash
curl -A "facebookexternalhit/1.1" "https://fe-eco.onrender.com/products/airpods-pro"
```

### 3. Test với browser console:
```javascript
// Kiểm tra meta tags
document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
  console.log(meta.getAttribute('property'), meta.getAttribute('content'));
});

// Kiểm tra product tags
document.querySelectorAll('meta[property^="product:"]').forEach(meta => {
  console.log(meta.getAttribute('property'), meta.getAttribute('content'));
});
```

### 4. Checklist cần kiểm tra:
- [ ] og:title có hiển thị tên sản phẩm
- [ ] og:description có mô tả sản phẩm
- [ ] og:image có URL hình ảnh sản phẩm
- [ ] og:url có URL canonical
- [ ] product:brand có thương hiệu
- [ ] product:price:amount có giá
- [ ] product:availability có trạng thái stock
- [ ] ia:markup_url có URL

### 5. Sửa lỗi thường gặp:

#### Lỗi 403 Forbidden:
- Kiểm tra robots.txt
- Thêm User-agent: facebookexternalhit
- Allow: /products/

#### Meta tags trống:
- Kiểm tra SSR có hoạt động
- Kiểm tra API backend có trả về data
- Kiểm tra console log server

#### Hydration errors:
- Kiểm tra client và server render giống nhau
- Sử dụng startTransition
- Suppress development warnings

### 6. Debug commands:
```bash
# Check if server is responding
curl -I "https://fe-eco.onrender.com/products/airpods-pro"

# Check robots.txt
curl "https://fe-eco.onrender.com/robots.txt"

# Simulate Facebook crawler
curl -A "facebookexternalhit/1.1" -s "https://fe-eco.onrender.com/products/airpods-pro" | grep -i "og:"
```

### 7. Kết quả mong đợi:
```html
<meta property="og:title" content="AirPods Pro | ECom Store" />
<meta property="og:description" content="Mua AirPods Pro với giá tốt nhất..." />
<meta property="og:image" content="https://be-ecom-2hfk.onrender.com/images/..." />
<meta property="og:url" content="https://fe-eco.onrender.com/products/airpods-pro" />
<meta property="product:brand" content="Apple" />
<meta property="product:price:amount" content="5990000" />
<meta property="product:availability" content="in stock" />
```

---
Test date: January 2025
