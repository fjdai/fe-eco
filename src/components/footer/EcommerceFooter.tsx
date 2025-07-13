import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Button,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    YouTube,
    LinkedIn,
    ShoppingBag,
    Email,
    Phone,
    LocationOn,
    Security,
    LocalShipping,
    Support,
    Verified
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EcommerceFooter = () => {
    const navigate = useNavigate();
    const footerSections = [
        {
            title: 'Về chúng tôi',
            links: [
                { text: 'Giới thiệu', path: '/about' },
                { text: 'Tuyển dụng', path: '/careers' },
                { text: 'Tin tức', path: '/news' },
                { text: 'Đối tác', path: '/partners' }
            ]
        },
        {
            title: 'Chăm sóc khách hàng',
            links: [
                { text: 'Trung tâm hỗ trợ', path: '/support' },
                { text: 'Hướng dẫn đặt hàng', path: '/order-guide' },
                { text: 'Chính sách đổi trả', path: '/return-policy' },
                { text: 'Câu hỏi thường gặp', path: '/faq' }
            ]
        },
        {
            title: 'Chính sách',
            links: [
                { text: 'Điều khoản sử dụng', path: '/terms' },
                { text: 'Chính sách bảo mật', path: '/privacy' },
                { text: 'Chính sách thanh toán', path: '/payment-policy' },
                { text: 'Chính sách vận chuyển', path: '/shipping-policy' }
            ]
        },
        {
            title: 'Danh mục sản phẩm',
            links: [
                { text: 'Điện thoại', path: '/products?category=phones' },
                { text: 'Laptop', path: '/products?category=laptops' },
                { text: 'Phụ kiện', path: '/products?category=accessories' },
                { text: 'Đồng hồ thông minh', path: '/products?category=smartwatches' }
            ]
        }
    ];

    const features = [
        {
            icon: <LocalShipping sx={{ fontSize: 24 }} />,
            title: 'Miễn phí vận chuyển',
            description: 'Cho đơn hàng từ 500K'
        },
        {
            icon: <Security sx={{ fontSize: 24 }} />,
            title: 'Thanh toán bảo mật',
            description: 'Bảo mật 100%'
        },
        {
            icon: <Support sx={{ fontSize: 24 }} />,
            title: 'Hỗ trợ 24/7',
            description: 'Tư vấn miễn phí'
        },
        {
            icon: <Verified sx={{ fontSize: 24 }} />,
            title: 'Chính hãng',
            description: 'Cam kết 100%'
        }
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                mt: 'auto'
            }}
        >
            {/* Features Section */}
            <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '50%',
                                            p: 1.5,
                                            color: '#3498db'
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Main Footer Content */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <ShoppingBag sx={{ fontSize: 32, color: '#3498db' }} />
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    ECom
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                                Nền tảng mua sắm trực tuyến hàng đầu Việt Nam, mang đến trải nghiệm 
                                mua sắm tuyệt vời với hàng triệu sản phẩm chất lượng cao.
                            </Typography>
                            
                            {/* Contact Info */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationOn sx={{ fontSize: 20, color: '#3498db' }} />
                                    <Typography variant="body2">
                                        123 Đường ABC, Quận 1, TP.HCM
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Phone sx={{ fontSize: 20, color: '#3498db' }} />
                                    <Typography variant="body2">
                                        1900 1234 (Miễn phí)
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email sx={{ fontSize: 20, color: '#3498db' }} />
                                    <Typography variant="body2">
                                        support@ecom.vn
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Social Media */}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Kết nối với chúng tôi
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {[
                                        { icon: <Facebook />, color: '#1877f2', label: 'Facebook' },
                                        { icon: <Instagram />, color: '#e4405f', label: 'Instagram' },
                                        { icon: <Twitter />, color: '#1da1f2', label: 'Twitter' },
                                        { icon: <YouTube />, color: '#ff0000', label: 'YouTube' },
                                        { icon: <LinkedIn />, color: '#0077b5', label: 'LinkedIn' }
                                    ].map((social, index) => (
                                        <IconButton
                                            key={index}
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: social.color,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 4px 12px ${social.color}40`
                                                }
                                            }}
                                            aria-label={social.label}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Footer Links */}
                    {footerSections.map((section, index) => (
                        <Grid item xs={12} sm={6} md={2} key={index}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#3498db' }}>
                                {section.title}
                            </Typography>
                            <List sx={{ p: 0 }}>
                                {section.links.map((link, linkIndex) => (
                                    <ListItem 
                                        key={linkIndex} 
                                        sx={{ 
                                            p: 0, 
                                            mb: 1,
                                            '&:hover': {
                                                cursor: 'pointer'
                                            }
                                        }}
                                        onClick={() => navigate(link.path)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        opacity: 0.8,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            opacity: 1,
                                                            color: '#3498db',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                >
                                                    {link.text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    ))}

                    {/* Newsletter Signup */}
                    <Grid item xs={12} md={4}>
                        {/* Download App */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#3498db' }}>
                            Tải ứng dụng
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: '#3498db',
                                        backgroundColor: 'rgba(52, 152, 219, 0.1)'
                                    }
                                }}
                            >
                                App Store
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: '#3498db',
                                        backgroundColor: 'rgba(52, 152, 219, 0.1)'
                                    }
                                }}
                            >
                                Google Play
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Footer */}
            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', py: 3 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ opacity: 0.8, textAlign: { xs: 'center', md: 'left' } }}>
                                © 2025 ECom. Tất cả quyền được bảo lưu.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    gap: 2, 
                                    justifyContent: { xs: 'center', md: 'flex-end' },
                                    flexWrap: 'wrap'
                                }}
                            >
                                {['Điều khoản', 'Bảo mật', 'Cookies', 'Sitemap'].map((item, index) => (
                                    <Link
                                        key={index}
                                        href="#"
                                        color="inherit"
                                        sx={{
                                            textDecoration: 'none',
                                            opacity: 0.8,
                                            fontSize: '0.875rem',
                                            transition: 'opacity 0.3s ease',
                                            '&:hover': {
                                                opacity: 1,
                                                color: '#3498db'
                                            }
                                        }}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default EcommerceFooter;
