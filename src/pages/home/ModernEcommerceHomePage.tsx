import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Paper,
    Rating,
    Chip,
    Skeleton,
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

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        color: 'primary.main',
                                        mb: 2,
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Featured Categories */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        Danh mục nổi bật
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Khám phá các sản phẩm hot nhất từ những danh mục được yêu thích
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="text" height={40} sx={{ mt: 1 }} />
                            </Grid>
                        ))
                    ) : (
                        featuredCategories.map((category: any) => (
                            <Grid item xs={12} sm={6} md={3} key={category.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        '&zzz:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 15px 40px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                    onClick={() => navigate(`/products?category=${category.slug || category.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`${import.meta.env.VITE_BACKEND_URL}/images/${category.image}` || 'https://via.placeholder.com/200'}
                                        alt={category.name}
                                        sx={{
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Storefront sx={{ fontSize: 40, color: 'primary.main' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {category.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

            {/* Featured Products */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                            Sản phẩm nổi bật
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Những sản phẩm được khách hàng yêu thích nhất
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/products')}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600
                        }}
                    >
                        Xem tất cả
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
                                <Skeleton variant="text" height={25} />
                                <Skeleton variant="text" height={25} />
                            </Grid>
                        ))
                    ) : (
                        featuredProducts.map((product: any) => (
                            <Grid item xs={12} sm={6} md={3} key={product.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 15px 40px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                    onClick={() => navigate(`/products/${product.slug || product.id}`)}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image={`${import.meta.env.VITE_BACKEND_URL}/images/${product.image}` || 'https://via.placeholder.com/250'}

                                            alt={product.name}
                                            sx={{
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        />
                                        <Chip
                                            label="Hot"
                                            color="error"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                left: 10,
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Rating value={product.rating} readOnly size="small" />
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                ({product.rating})
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 700
                                            }}
                                        >
                                            {formatPrice(product.price)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

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
