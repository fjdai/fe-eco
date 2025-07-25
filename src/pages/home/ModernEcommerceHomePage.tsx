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

            {/* Why Choose ECom Section */}
            <Container maxWidth="lg" sx={{ my: 10 }}>
                <Paper elevation={1} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)', mb: 6 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', letterSpacing: 1 }}>
                            Vì Sao Chọn ECom?
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Chúng tôi mang đến nhiều giá trị vượt trội cho khách hàng và đối tác
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>Đa dạng sản phẩm</Typography>
                            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                                Hàng ngàn sản phẩm thuộc nhiều ngành hàng khác nhau, từ điện tử, gia dụng, thời trang đến sức khỏe và làm đẹp. ECom luôn cập nhật xu hướng mới nhất để đáp ứng mọi nhu cầu của bạn.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>Dịch vụ khách hàng tận tâm</Typography>
                            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                                Đội ngũ CSKH chuyên nghiệp, hỗ trợ 24/7 qua nhiều kênh: hotline, email, chat trực tuyến. Chúng tôi luôn lắng nghe và giải quyết mọi thắc mắc của khách hàng nhanh chóng, hiệu quả.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>Ưu đãi & bảo mật</Typography>
                            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                                Nhiều chương trình khuyến mãi hấp dẫn, tích điểm đổi quà, miễn phí vận chuyển và chính sách bảo mật thông tin cá nhân nghiêm ngặt, giúp bạn yên tâm mua sắm mỗi ngày.
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* How It Works Section */}
            <Container maxWidth="lg" sx={{ my: 10 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: 'linear-gradient(120deg, #e0e7ff 60%, #f8fafc 100%)', mb: 6 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', letterSpacing: 1 }}>
                            Quy Trình Mua Sắm Đơn Giản
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Chỉ với 4 bước, bạn đã có thể sở hữu sản phẩm yêu thích trên ECom
                        </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>1</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Đăng ký/Đăng nhập</Typography>
                                <Typography variant="body2">Tạo tài khoản hoặc đăng nhập để bắt đầu mua sắm và nhận ưu đãi thành viên.</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>2</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Chọn sản phẩm</Typography>
                                <Typography variant="body2">Duyệt danh mục, tìm kiếm sản phẩm phù hợp và thêm vào giỏ hàng.</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>3</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Thanh toán an toàn</Typography>
                                <Typography variant="body2">Chọn phương thức thanh toán phù hợp, nhập thông tin và xác nhận đơn hàng.</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>4</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Nhận hàng & đánh giá</Typography>
                                <Typography variant="body2">Đơn hàng sẽ được giao tận nơi. Đừng quên đánh giá sản phẩm để nhận thêm ưu đãi!</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* About Us Section - Redesigned and Expanded */}
            <Container maxWidth="lg" sx={{ my: 10 }}>
                <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)' }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: { xs: 3, md: 0 } }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', letterSpacing: 1 }}>
                                    Về ECom
                                </Typography>
                                <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
                                    Đổi mới trải nghiệm mua sắm trực tuyến tại Việt Nam
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', color: 'text.primary' }}>
                                    ECom là nền tảng thương mại điện tử hiện đại, kết nối hàng triệu khách hàng với các sản phẩm chất lượng cao và dịch vụ tận tâm. Chúng tôi không chỉ cung cấp hàng ngàn sản phẩm đa dạng từ các thương hiệu uy tín mà còn mang đến trải nghiệm mua sắm an toàn, tiện lợi và minh bạch.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', color: 'text.primary' }}>
                                    <b>Sứ mệnh</b> của ECom là tạo ra một hệ sinh thái thương mại số bền vững, nơi khách hàng được phục vụ tận tâm và các nhà bán hàng được hỗ trợ phát triển lâu dài. Chúng tôi cam kết đổi mới liên tục, ứng dụng công nghệ tiên tiến để nâng cao chất lượng dịch vụ và tối ưu hóa trải nghiệm người dùng.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', color: 'text.primary' }}>
                                    <b>Giá trị cốt lõi</b> của chúng tôi là: <b>Khách hàng là trung tâm</b>, <b>Chính trực</b>, <b>Đổi mới</b> và <b>Hợp tác phát triển</b>. Đội ngũ ECom luôn lắng nghe, thấu hiểu và đồng hành cùng khách hàng trên hành trình mua sắm trực tuyến.
                                </Typography>
                                <Typography variant="body1" sx={{ textAlign: 'justify', color: 'text.primary' }}>
                                    Hãy khám phá ECom ngay hôm nay để tận hưởng ưu đãi hấp dẫn, dịch vụ chuyên nghiệp và trải nghiệm mua sắm tuyệt vời mỗi ngày!
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img src="/src/assets/clinic-home.png" alt="ECom Team" style={{ maxWidth: '100%', borderRadius: 16, boxShadow: '0 8px 32px rgba(100,100,200,0.08)' }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* Customer Testimonials Section */}
            <Container maxWidth="lg" sx={{ my: 10 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)', mb: 6 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', letterSpacing: 1 }}>
                            Khách Hàng Nói Gì Về ECom
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Những chia sẻ thực tế từ khách hàng đã trải nghiệm dịch vụ của chúng tôi
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                                    “Tôi rất hài lòng với dịch vụ giao hàng nhanh và sản phẩm chất lượng của ECom. Đội ngũ CSKH hỗ trợ rất nhiệt tình!”
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Nguyễn Thị Lan</Typography>
                                <Typography variant="caption" color="text.secondary">Khách hàng Hà Nội</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                                    “ECom có nhiều chương trình ưu đãi hấp dẫn, sản phẩm đa dạng và giá cả hợp lý. Tôi sẽ tiếp tục ủng hộ!”
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Trần Văn Minh</Typography>
                                <Typography variant="caption" color="text.secondary">Khách hàng TP.HCM</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                                    “Tôi đánh giá cao chính sách bảo mật và đổi trả của ECom. Mua sắm online chưa bao giờ dễ dàng và an tâm đến vậy!”
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Lê Hoàng Yến</Typography>
                                <Typography variant="caption" color="text.secondary">Khách hàng Đà Nẵng</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* FAQ Section - Redesigned and Expanded */}
            <Container maxWidth="lg" sx={{ my: 10 }}>
                <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: 'linear-gradient(120deg, #e0e7ff 60%, #f8fafc 100%)' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', letterSpacing: 1 }}>
                            Câu Hỏi Thường Gặp
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Giải đáp chi tiết các thắc mắc phổ biến về ECom và dịch vụ của chúng tôi
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    1. Làm thế nào để đặt hàng trên ECom?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Bạn chỉ cần chọn sản phẩm yêu thích, thêm vào giỏ hàng và tiến hành thanh toán theo hướng dẫn. Đội ngũ của chúng tôi sẽ xử lý đơn hàng và giao đến tận nơi cho bạn trên toàn quốc.
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    2. Tôi có thể đổi trả sản phẩm không?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    ECom hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng đối với các sản phẩm đáp ứng điều kiện đổi trả. Vui lòng liên hệ bộ phận CSKH để được hướng dẫn chi tiết và hỗ trợ nhanh chóng.
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    3. Phương thức thanh toán nào được chấp nhận?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử, QR code và thanh toán khi nhận hàng (COD).
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    4. Thời gian giao hàng dự kiến là bao lâu?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Thông thường, đơn hàng sẽ được giao trong vòng 1-3 ngày làm việc tại các thành phố lớn và 3-7 ngày tại các khu vực khác. Bạn có thể theo dõi trạng thái đơn hàng trực tiếp trên website.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    5. Làm sao để liên hệ hỗ trợ khách hàng?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Bạn có thể liên hệ với chúng tôi qua hotline, email hoặc chat trực tuyến trên website để được hỗ trợ nhanh chóng và tận tình 24/7.
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    6. ECom có chương trình khách hàng thân thiết không?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Có! Khi đăng ký tài khoản và mua sắm thường xuyên, bạn sẽ nhận được điểm thưởng, ưu đãi sinh nhật và nhiều phần quà hấp dẫn khác.
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    7. Làm sao để trở thành nhà bán hàng trên ECom?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Nếu bạn muốn hợp tác kinh doanh, hãy truy cập mục "Đăng ký bán hàng" trên website để gửi thông tin. Đội ngũ ECom sẽ liên hệ tư vấn và hỗ trợ bạn phát triển gian hàng.
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    8. ECom bảo vệ thông tin cá nhân của khách hàng như thế nào?
                                </Typography>
                                <Typography variant="body2">
                                    Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng theo chính sách bảo mật và tuân thủ quy định pháp luật hiện hành.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
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
