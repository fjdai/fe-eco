import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Email,
  Send,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const NewsletterContainer = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(4),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const subscribeToMailchimp = async (emailAddress: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch('/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          firstName,
          lastName
        })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('MailChimp subscription error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !firstName) {
      setMessage('Please fill in all required fields');
      setIsSuccess(false);
      setShowSnackbar(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToMailchimp(email, firstName, lastName);
      
      if (result.success) {
        setMessage('Successfully subscribed to our newsletter!');
        setIsSuccess(true);
        setEmail('');
        setFirstName('');
        setLastName('');
        
        // Track newsletter signup
        if ((window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: 'mailchimp_subscription'
          });
        }
      } else {
        setMessage(result.data?.message || 'Subscription failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      setIsSuccess(false);
    }

    setIsLoading(false);
    setShowSnackbar(true);
  };

  return (
    <>
      {/* Main Newsletter Signup */}
      <NewsletterContainer elevation={4}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Email sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h2" fontWeight="bold">
              Stay Updated
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
            Subscribe to Our Newsletter
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Get the latest deals, new products, and exclusive offers delivered to your inbox
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': { backgroundColor: '#f5f5f5' },
                px: 4,
                py: 1.5
              }}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
            We respect your privacy. Unsubscribe at any time.
          </Typography>
        </Container>
      </NewsletterContainer>

      {/* Newsletter Benefits */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h5" component="h3" textAlign="center" gutterBottom>
          Why Subscribe to Our Newsletter?
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Email color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Exclusive Deals
                </Typography>
                <Typography color="text.secondary">
                  Get access to special discounts and offers only available to subscribers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <CheckCircle color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  First to Know
                </Typography>
                <Typography color="text.secondary">
                  Be the first to hear about new product launches and updates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Email color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Quality Content
                </Typography>
                <Typography color="text.secondary">
                  Receive curated content, tips, and insights delivered weekly
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Success/Error Messages */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={isSuccess ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewsletterSignup;
