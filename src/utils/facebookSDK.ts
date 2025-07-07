// Facebook SDK và các utility functions để tối ưu hóa sharing

// Extend window object to include FB
declare global {
  interface Window {
    FB: any;
  }
}

export const initializeFacebookSDK = () => {
  if (typeof window !== 'undefined' && window.FB) {
    window.FB.init({
      appId: process.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
      version: 'v18.0',
      xfbml: true,
      cookie: true
    });
  }
};

export const shareOnFacebook = (url: string, title: string, description: string, image: string) => {
  if (typeof window !== 'undefined' && window.FB) {
    window.FB.ui({
      method: 'share',
      href: url,
      quote: `${title} - ${description}`,
      picture: image,
      name: title,
      description: description
    }, (response: any) => {
      if (response && !response.error_message) {
        console.log('Share successful');
      } else {
        console.log('Share failed');
      }
    });
  } else {
    // Fallback to direct Facebook share URL
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${title} - ${description}`)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

// Utility để validate Open Graph tags
export const validateOGTags = (product: any) => {
  const requiredOGTags = {
    'og:title': product.name,
    'og:description': product.description,
    'og:image': product.image,
    'og:url': window.location.href,
    'og:type': 'product',
    'product:brand': product.brand,
    'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
    'product:condition': 'new',
    'product:price:amount': String(product.salePrice || product.price),
    'product:price:currency': 'VND'
  };
  
  return requiredOGTags;
};

// Trigger Facebook to re-scrape the page
export const refreshFacebookCache = async (url: string) => {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/?id=${encodeURIComponent(url)}&scrape=true&access_token=${process.env.VITE_FACEBOOK_ACCESS_TOKEN}`, {
      method: 'POST'
    });
    
    if (response.ok) {
      console.log('Facebook cache refreshed successfully');
    }
  } catch (error) {
    console.error('Error refreshing Facebook cache:', error);
  }
};
