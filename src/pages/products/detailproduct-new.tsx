import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Rating,
  Chip,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  Avatar,
  IconButton,
  TextField,
  Breadcrumbs,
  Link,
  Paper,
  Dialog,
  DialogContent,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Add,
  Remove,
  Close,
  ZoomIn,
  ZoomOut,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  FacebookShareButton,
  FacebookIcon,
} from 'react-share';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getProductImageUrl, PLACEHOLDER_IMAGE } from '../../utils/imageHelpers';
import { callGetProductBySlug } from '../../services/apiProducts/apiProducts';
import { addToCart, addToCartAsync, fetchCart } from '../../redux/cart/cartSlice';
import { Product } from '../../types/product';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '12px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  overflowX: 'auto',
  padding: theme.spacing(1, 0),
  '&::-webkit-scrollbar': {
    height: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 3,
  },
}));

const ThumbnailImage = styled('img')<{ selected?: boolean }>(({ theme, selected }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 8,
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
  fontSize: '1.2rem',
}));

const SalePrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const RegularPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const QuantityContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const ShareContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Utility functions
const getPageUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return 'https://fe-eco.onrender.com';
};

const getFullimageUrl = (imagePath: string) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  if (imagePath.startsWith('http')) return imagePath;
  return `${process.env.VITE_BACKEND_URL || 'https://be-ecom-2hfk.onrender.com'}${imagePath}`;
};

interface ProductDetailPageProps {
  pageProps?: {
    product?: any;
    error?: string;
  };
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ pageProps }) => {
  const ssrProduct = pageProps?.product;
  const ssrError = pageProps?.error;

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux selectors
  const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated);
  const cartItems = useSelector((state: any) => state.cart.items);
  const isSyncing = useSelector((state: any) => state.cart.isSyncing);

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(ssrError || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Image gallery states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

  // SEO data - prioritize SSR data for immediate meta rendering
  const seoProduct = ssrProduct || product;
  const pageUrl = getPageUrl();
  const productImageUrl = seoProduct ? getFullimageUrl(seoProduct.image) : '';
  const productTitle = seoProduct ? (seoProduct.meta_title || `${seoProduct.name} | ECom Store`) : 'ECom Store';
  const productDescription = seoProduct ? (seoProduct.meta_description || `Mua ${seoProduct.name} với giá tốt nhất. ${seoProduct.description || ''}`.slice(0, 160)) : 'Cửa hàng trực tuyến';

  // Transform product data
  const transformProductData = (productData: any) => ({
    ...productData,
    price: parseFloat(productData.price) || 0,
    salePrice: productData.sale_price ? parseFloat(productData.sale_price) : undefined,
    images: productData.images && productData.images.length > 0 
      ? productData.images.map((imageName: string) => getProductImageUrl(imageName))
      : [getProductImageUrl(productData.image)],
    image: getProductImageUrl(productData.image),
    category: productData.category || { name: 'N/A', slug: 'na' },
    reviews: productData.reviews?.map((review: any) => ({
      ...review,
      user: {
        ...review.user,
        name: review.user?.name || 'Anonymous User'
      }
    })) || [],
    reviewCount: productData.reviews?.length || 0,
    rating: productData.reviews?.length > 0 
      ? productData.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / productData.reviews.length
      : 0,
    features: productData.features || [
      'Thiết kế hiện đại và sang trọng',
      'Chất lượng cao, độ bền tốt',
      'Công nghệ tiên tiến',
      'Dễ dàng sử dụng',
      'Bảo hành chính hãng'
    ],
    specifications: productData.specifications || {
      'Thương hiệu': productData.brand || 'N/A',
      'Danh mục': productData.category?.name || 'N/A',
      'Trọng lượng': productData.weight ? `${productData.weight}g` : 'N/A',
      'Kích thước': productData.dimensions || 'N/A',
      'Mã sản phẩm (SKU)': productData.sku || 'N/A',
      'Tình trạng': (productData.stock || 0) > 0 ? 'Còn hàng' : 'Hết hàng',
      'Số lượng trong kho': productData.stock ? `${productData.stock} sản phẩm` : 'N/A'
    },
    metaTitle: productData.meta_title || `${productData.name} | ECom Store`,
    metaDescription: productData.meta_description || 
      `Mua ${productData.name} với giá tốt nhất. ${productData.description || ''}`.slice(0, 160),
    metaKeywords: productData.meta_keywords || 
      `${productData.name}, ${productData.category?.name || ''}, ${productData.brand || ''}, mua online`.toLowerCase(),
    createdAt: productData.createAt,
    updatedAt: productData.updateAt,
    fullDescription: productData.fullDescription || productData.description
  });

  // Process SSR product data first
  useEffect(() => {
    if (ssrProduct) {
      setProduct(transformProductData(ssrProduct));
      setLoading(false);
    }
  }, [ssrProduct]);

  // Fetch product data if no SSR data
  useEffect(() => {
    if (!ssrProduct && slug) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          setError('');
          const response = await callGetProductBySlug(slug);
          if ((response as any)?.statusCode === 200 && (response as any)?.data) {
            setProduct(transformProductData((response as any).data));
          } else {
            setError('Không tìm thấy sản phẩm');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Có lỗi xảy ra khi tải sản phẩm');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [slug, ssrProduct]);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart() as any);
    }
  }, [isAuthenticated, dispatch]);

  // Calculate cart quantity for this product
  const cartQuantity = cartItems.filter((item: any) => item.productId === product?.id)
    .reduce((sum: number, item: any) => sum + item.quantity, 0);
  const maxQuantity = Math.max(0, (product?.stock || 0) - cartQuantity);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng!');
      return;
    }
    
    if (!product.stock || product.stock <= 0) {
      toast.error('Sản phẩm hiện đã hết hàng!');
      return;
    }
    
    if (quantity > maxQuantity) {
      toast.error(`Chỉ còn ${maxQuantity} sản phẩm có thể thêm vào giỏ hàng (đã có ${cartQuantity} trong giỏ)!`);
      return;
    }

    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      
      const cartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0] || product.image || PLACEHOLDER_IMAGE,
        quantity: quantity,
        stock: product.stock,
        slug: product.slug || slug || ''
      };
      
      const result = await dispatch(addToCartAsync({
        productId: product.id,
        quantity: quantity,
        productData: cartItem
      }) as any);
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
        setQuantity(1);
      } else {
        dispatch(addToCart(cartItem));
        toast.success(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
        setQuantity(1);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) {
      toast.error('Không thể mua sản phẩm này!');
      return;
    }
    
    if (!product.stock || product.stock <= 0) {
      toast.error('Sản phẩm hiện đã hết hàng!');
      return;
    }

    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để mua sản phẩm');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      
      const cartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0] || product.image || PLACEHOLDER_IMAGE,
        quantity: quantity,
        stock: product.stock,
        slug: product.slug || slug || ''
      };
      
      dispatch(addToCart(cartItem));
      toast.success(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
      
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
      
    } catch (error) {
      console.error('Error in buy now:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để đánh giá sản phẩm');
      navigate('/login');
      return;
    }
    
    if (newReview.comment.trim()) {
      toast.success('Đã gửi đánh giá!');
      setNewReview({ rating: 5, comment: '' });
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Render SEO meta tags first - even if loading
  const renderSEOTags = () => (
    <Helmet>
      <title>{productTitle}</title>
      <meta name="description" content={productDescription} />
      <meta name="keywords" content={seoProduct?.meta_keywords || `${seoProduct?.name || 'sản phẩm'}, mua online, ECom Store`} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={productTitle} />
      <meta property="og:description" content={productDescription} />
      <meta property="og:image" content={productImageUrl} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="ECom Store" />
      <meta property="og:locale" content="vi_VN" />
      
      {seoProduct && (
        <>
          <meta property="product:brand" content={seoProduct.brand || 'ECom Store'} />
          <meta property="product:availability" content={(seoProduct.stock || 0) > 0 ? 'in stock' : 'out of stock'} />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content={String(seoProduct.sale_price || seoProduct.price)} />
          <meta property="product:price:currency" content="VND" />
          <meta property="product:retailer_item_id" content={String(seoProduct.id)} />
          <meta property="product:category" content={seoProduct.category?.name || 'General'} />
          
          <meta property="ia:markup_url" content={pageUrl} />
          <meta property="ia:markup_url_dev" content={pageUrl} />
          
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": seoProduct.name,
              "image": [productImageUrl],
              "description": seoProduct.description,
              "sku": seoProduct.sku || seoProduct.id,
              "brand": {
                "@type": "Brand",
                "name": seoProduct.brand || "ECom Store"
              },
              "category": seoProduct.category?.name || "General",
              "offers": {
                "@type": "Offer",
                "url": pageUrl,
                "priceCurrency": "VND",
                "price": seoProduct.sale_price || seoProduct.price,
                "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "availability": (seoProduct.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                  "@type": "Organization",
                  "name": "ECom Store"
                }
              }
            })}
          </script>
        </>
      )}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={productTitle} />
      <meta name="twitter:description" content={productDescription} />
      <meta name="twitter:image" content={productImageUrl} />
      
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ECom Store" />
    </Helmet>
  );

  if (loading) {
    return (
      <>
        {renderSEOTags()}
        <StyledContainer maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Typography variant="h6">Đang tải sản phẩm...</Typography>
          </Box>
        </StyledContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        {renderSEOTags()}
        <StyledContainer maxWidth="lg">
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="error">
              Có lỗi xảy ra
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => navigate('/products')}>
                Trở về danh sách sản phẩm
              </Button>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </Box>
          </Box>
        </StyledContainer>
      </>
    );
  }

  if (!product) {
    return (
      <>
        {renderSEOTags()}
        <StyledContainer maxWidth="lg">
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Không tìm thấy sản phẩm
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Sản phẩm với slug "{slug}" không tồn tại hoặc đã bị xóa.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/products')}>
              Trở về danh sách sản phẩm
            </Button>
          </Box>
        </StyledContainer>
      </>
    );
  }

  return (
    <>
      {renderSEOTags()}
      <StyledContainer maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link color="inherit" href="/">Trang chủ</Link>
          <Link color="inherit" href="/products">Sản phẩm</Link>
          {product.category && (
            <Link color="inherit" href={`/category/${product.category.slug || ''}`}>
              {product.category.name}
            </Link>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box>
              <ProductImage
                src={product.images?.[selectedImageIndex] || product.image || PLACEHOLDER_IMAGE}
                alt={product.name}
                onClick={() => setImageGalleryOpen(true)}
                style={{ cursor: 'pointer' }}
              />
              
              {product.images && product.images.length > 1 && (
                <ThumbnailContainer>
                  {product.images.map((image, index) => (
                    <ThumbnailImage
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      selected={index === selectedImageIndex}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </ThumbnailContainer>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={product.rating || 0} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({product.reviewCount || 0} đánh giá)
              </Typography>
            </Box>

            <PriceContainer>
              {product.salePrice ? (
                <>
                  <SalePrice variant="h4">
                    {product.salePrice.toLocaleString('vi-VN')} ₫
                  </SalePrice>
                  <OriginalPrice variant="h6">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </OriginalPrice>
                  <Chip 
                    label={`-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%`}
                    color="error"
                    size="small"
                  />
                </>
              ) : (
                <RegularPrice variant="h4">
                  {product.price.toLocaleString('vi-VN')} ₫
                </RegularPrice>
              )}
            </PriceContainer>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tình trạng:
              </Typography>
              <Chip 
                label={product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                color={product.stock > 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Danh mục:
              </Typography>
              <Chip 
                label={product.category?.name || 'N/A'}
                color="primary"
                size="small"
                variant="outlined"
              />
            </Box>

            {product.brand && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Thương hiệu:
                </Typography>
                <Chip 
                  label={product.brand}
                  color="secondary"
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}

            <QuantityContainer>
              <Typography variant="body2" color="text.secondary">
                Số lượng:
              </Typography>
              <IconButton 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                size="small"
              >
                <Remove />
              </IconButton>
              <Typography variant="h6" sx={{ mx: 2, minWidth: 30, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                size="small"
              >
                <Add />
              </IconButton>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                ({maxQuantity} sản phẩm có thể thêm)
              </Typography>
            </QuantityContainer>

            <ActionButtonContainer>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0 || addingToCart || quantity > maxQuantity}
                sx={{ flex: 1 }}
              >
                {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleBuyNow}
                disabled={!product.stock || product.stock <= 0 || addingToCart}
                sx={{ flex: 1 }}
              >
                Mua ngay
              </Button>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                color={isFavorite ? 'error' : 'default'}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </ActionButtonContainer>

            <ShareContainer>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Chia sẻ:
              </Typography>
              <FacebookShareButton url={pageUrl} title={product.name}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </ShareContainer>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Mô tả" />
            <Tab label="Thông số kỹ thuật" />
            <Tab label="Đánh giá" />
          </Tabs>

          <TabPanel value={selectedTab} index={0}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {product.fullDescription || product.description}
            </Typography>
            
            {product.features && product.features.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tính năng nổi bật:
                </Typography>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <Typography variant="body1">{feature}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Grid container spacing={2}>
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {key}:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="body1">
                      {value as string}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Đánh giá sản phẩm
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Rating value={product.rating || 0} readOnly />
                <Typography variant="body1">
                  {product.rating ? product.rating.toFixed(1) : 0}/5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({product.reviewCount || 0} đánh giá)
                </Typography>
              </Box>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Viết đánh giá
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Đánh giá:
                    </Typography>
                    <Rating
                      value={newReview.rating}
                      onChange={(event, newValue) => {
                        setNewReview(prev => ({ ...prev, rating: newValue || 5 }));
                      }}
                    />
                  </Box>
                  
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    disabled={!newReview.comment.trim()}
                  >
                    Gửi đánh giá
                  </Button>
                </CardContent>
              </Card>

              {product.reviews && product.reviews.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Đánh giá từ khách hàng
                  </Typography>
                  {product.reviews.map((review, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {review.user?.name?.[0] || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {review.user?.name || 'Khách hàng'}
                            </Typography>
                            <Rating value={review.rating || 5} readOnly size="small" />
                          </Box>
                        </Box>
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>
        </Box>

        <Dialog
          open={imageGalleryOpen}
          onClose={() => setImageGalleryOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setImageGalleryOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ position: 'relative', textAlign: 'center' }}>
              <img
                src={product.images?.[selectedImageIndex] || product.image || PLACEHOLDER_IMAGE}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  transform: `scale(${imageZoom})`
                }}
              />
              
              {product.images && product.images.length > 1 && (
                <>
                  <IconButton
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? product.images!.length - 1 : prev - 1
                    )}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === product.images!.length - 1 ? 0 : prev + 1
                    )}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </>
              )}
              
              <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                <IconButton
                  onClick={() => setImageZoom(prev => Math.min(prev + 0.25, 3))}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    mr: 1,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                  }}
                >
                  <ZoomIn />
                </IconButton>
                <IconButton
                  onClick={() => setImageZoom(prev => Math.max(prev - 0.25, 0.5))}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                  }}
                >
                  <ZoomOut />
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </StyledContainer>
    </>
  );
};

export default ProductDetailPage;
