import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Rating,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    ArrowForward,
    LocalShipping,
    Security,
    Support,
    Verified,
    Storefront
} from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { callGetHomePageData, callGetFeaturedProducts, callGetFeaturedCategories } from '../../services/apiEcommerce/apiHome';

// Types
interface Product {
    id: number | string;
    name: string;
    price: number;
    image: string;
    rating: number;
    category?: string;
    slug?: string;
}

interface Category {
    id: number | string;
    name: string;
    image: string;
    slug?: string;
    productCount?: number;
}





const ModernEcommerceHomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await callGetHomePageData();
            
            if (response?.data?.success) {
                setFeaturedProducts(response.data.featuredProducts || []);
                setFeaturedCategories(response.data.featuredCategories || []);
                
            } else {
                throw new Error('API response không hợp lệ');
            }
        } catch (err: any) {
            // Try individual API calls as fallback
            setError('Đang thử kết nối lại API...');
            
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    callGetFeaturedProducts(4),
                    callGetFeaturedCategories(4)
                ]);
                
                if (productsResponse?.data && categoriesResponse?.data) {
                    setFeaturedProducts(productsResponse.data || []);
                    setFeaturedCategories(categoriesResponse.data || []);
                    setError(null);
                    return;
                }
            } catch (fallbackError) {
                console.error('❌ Fallback API calls also failed:', fallbackError);
            }
            
            // Set error message - no mock data fallback
            setError('Không thể tải dữ liệu từ server. Vui lòng thử lại sau.');
            setFeaturedProducts([]);
            setFeaturedCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const heroSlides = [
        {
            title: 'Khuyến mãi đặc biệt',
            subtitle: 'Giảm giá lên đến 70% cho tất cả sản phẩm',
            description: 'Cơ hội mua sắm tuyệt vời với hàng ngàn sản phẩm chất lượng cao',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
            buttonText: 'Mua ngay',
            buttonAction: () => navigate('/products'),
            bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: 'Sản phẩm mới nhất',
            subtitle: 'Khám phá những xu hướng công nghệ mới',
            description: 'Bộ sưu tập mới với thiết kế hiện đại và công nghệ tiên tiến',
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop',
            buttonText: 'Khám phá',
            buttonAction: () => navigate('/categories'),
            bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: 'Miễn phí vận chuyển',
            subtitle: 'Cho đơn hàng từ 500.000đ',
            description: 'Giao hàng nhanh chóng trong vòng 24h tại TP.HCM và Hà Nội',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
            buttonText: 'Tìm hiểu thêm',
            buttonAction: () => navigate('/shipping-info'),
            bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
    ];

    const features = [
        {
            icon: <LocalShipping sx={{ fontSize: 40 }} />,
            title: "Miễn phí vận chuyển",
            description: "Cho đơn hàng trên 500.000đ"
        },
        {
            icon: <Security sx={{ fontSize: 40 }} />,
            title: "Thanh toán bảo mật",
            description: "100% an toàn và đáng tin cậy"
        },
        {
            icon: <Support sx={{ fontSize: 40 }} />,
            title: "Hỗ trợ 24/7",
            description: "Luôn sẵn sàng hỗ trợ bạn"
        },
        {
            icon: <Verified sx={{ fontSize: 40 }} />,
            title: "Chất lượng đảm bảo",
            description: "Sản phẩm chính hãng 100%"
        }
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <Box>
            {/* Error Alert */}
            {error && (
                <Container maxWidth="lg" sx={{ mb: 2 }}>
                    <Alert 
                        severity="warning" 
                        action={
                            <Button 
                                color="inherit" 
                                size="small" 
                                onClick={loadHomeData}
                                sx={{ ml: 1 }}
                            >
                                Thử lại
                            </Button>
                        }
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                </Container>
            )}

            {/* Hero Slider */}
            <Box sx={{ mb: 6 }}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    loop
                    style={{ height: '500px' }}
                >
                    {heroSlides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                sx={{
                                    height: '100%',
                                    background: slide.bgGradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Background Image */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundImage: `url(${slide.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        opacity: 0.3,
                                        zIndex: 1
                                    }}
                                />
                                
                                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                                    <Grid container spacing={4} alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                                                <Typography
                                                    variant="h2"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 2,
                                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                                        lineHeight: 1.2,
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    {slide.title}
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        mb: 2,
                                                        fontWeight: 400,
                                                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                                                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    {slide.subtitle}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        mb: 4,
                                                        fontSize: '1.1rem',
                                                        opacity: 0.9,
                                                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    {slide.description}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={slide.buttonAction}
                                                    sx={{
                                                        px: 4,
                                                        py: 1.5,
                                                        fontSize: '1.1rem',
                                                        fontWeight: 600,
                                                        borderRadius: 2,
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: 'primary.main',
                                                        backdropFilter: 'blur(10px)',
                                                        '&:hover': {
                                                            background: 'rgba(255, 255, 255, 1)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    endIcon={<ArrowForward />}
                                                >
                                                    {slide.buttonText}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            {/* Features Section - HTML thuần */}
            <div className="features-section" style={{ maxWidth: '1200px', margin: '0 auto 48px auto', display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                {features.map((feature, index) => (
                    <div key={index} style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 300, background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 16, padding: 24, textAlign: 'center', transition: 'all 0.3s', margin: 0 }}>
                        <div style={{ color: '#1976d2', marginBottom: 16, display: 'flex', justifyContent: 'center', fontSize: 40 }}>
                            {feature.icon}
                        </div>
                        <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 20 }}>{feature.title}</h3>
                        <p style={{ color: '#666', fontSize: 15, margin: 0 }}>{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Featured Categories - HTML thuần */}
            <div className="featured-categories" style={{ maxWidth: '1200px', margin: '0 auto 48px auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ fontWeight: 700, marginBottom: 8, color: '#222', fontSize: 32 }}>Danh mục nổi bật</h2>
                    <p style={{ color: '#666', fontSize: 18 }}>Khám phá các sản phẩm hot nhất từ những danh mục được yêu thích</p>
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} style={{ width: 260, minHeight: 260, borderRadius: 16, background: '#f3f3f3', marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '100%', height: 200, background: '#e0e0e0', borderRadius: 12 }} />
                                <div style={{ width: '60%', height: 32, background: '#e0e0e0', borderRadius: 8, marginTop: 12 }} />
                            </div>
                        ))
                    ) : (
                        featuredCategories.map((category: any) => (
                            <div key={category.id} style={{ width: 260, borderRadius: 16, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', marginBottom: 16 }}
                                onClick={() => navigate(`/products?category=${category.slug || category.id}`)}
                            >
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/${category.image}` || 'https://via.placeholder.com/200'}
                                    alt={category.name}
                                    style={{ width: '100%', height: 200, objectFit: 'cover', transition: 'transform 0.3s' }}
                                />
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <div style={{ marginBottom: 12 }}>
                                        <Storefront sx={{ fontSize: 40, color: '#1976d2' }} />
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: 18 }}>{category.name}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Featured Products - HTML thuần */}
            <div className="featured-products" style={{ maxWidth: '1200px', margin: '0 auto 48px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h2 style={{ fontWeight: 700, marginBottom: 4, color: '#222', fontSize: 32 }}>Sản phẩm nổi bật</h2>
                        <p style={{ color: '#666', fontSize: 18, margin: 0 }}>Những sản phẩm được khách hàng yêu thích nhất</p>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        style={{ borderRadius: 12, padding: '8px 24px', fontWeight: 600, border: '1px solid #1976d2', background: '#fff', color: '#1976d2', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        Xem tất cả <ArrowForward />
                    </button>
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} style={{ width: 260, minHeight: 320, borderRadius: 16, background: '#f3f3f3', marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '100%', height: 250, background: '#e0e0e0', borderRadius: 12 }} />
                                <div style={{ width: '60%', height: 24, background: '#e0e0e0', borderRadius: 8, marginTop: 12 }} />
                                <div style={{ width: '40%', height: 20, background: '#e0e0e0', borderRadius: 8, marginTop: 8 }} />
                                <div style={{ width: '40%', height: 20, background: '#e0e0e0', borderRadius: 8, marginTop: 8 }} />
                            </div>
                        ))
                    ) : (
                        featuredProducts.map((product: any) => (
                            <div key={product.id} style={{ width: 260, borderRadius: 16, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', marginBottom: 16, position: 'relative' }}
                                onClick={() => navigate(`/products/${product.slug || product.id}`)}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/${product.image}` || 'https://via.placeholder.com/250'}
                                        alt={product.name}
                                        style={{ width: '100%', height: 250, objectFit: 'cover', transition: 'transform 0.3s' }}
                                    />
                                    <span style={{ position: 'absolute', top: 10, left: 10, background: '#d32f2f', color: '#fff', fontWeight: 600, borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>Hot</span>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 17, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        <Rating value={product.rating} readOnly size="small" />
                                        <span style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>({product.rating})</span>
                                    </div>
                                    <div style={{ color: '#1976d2', fontWeight: 700, fontSize: 18 }}>{formatPrice(product.price)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Call to Action Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 8,
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                        Bắt đầu mua sắm ngay hôm nay
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Khám phá hàng ngàn sản phẩm chất lượng cao với giá tốt nhất
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/products')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)',
                            color: 'primary.main',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 1)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                        endIcon={<ShoppingBag />}
                    >
                        Mua sắm ngay
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default ModernEcommerceHomePage;
