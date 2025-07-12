import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const MailchimpForm = () => {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
  const script = document.createElement('script');
  script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Đăng ký nhận tin</Typography>

      {!submitted ? (
        <form 
          action="https://onrender.us3.list-manage.com/subscribe/post?u=6a98d074a9be942b9c4242872&amp;id=2d815a347e&amp;f_id=00753ee1f0"
          method="post"
          target="hidden_iframe"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            type="email"
            name="EMAIL"
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tên"
            type="text"
            name="FNAME"
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Đăng ký
          </Button>
        </form>
      ) : (
        <Alert severity="success">Đăng ký thành công! Cảm ơn bạn đã theo dõi chúng tôi 🎉</Alert>
      )}

      {/* iframe ẩn để nhận kết quả */}
      <iframe name="hidden_iframe" style={{ display: 'none' }}></iframe>
    </Box>
  );
};

export default MailchimpForm;
