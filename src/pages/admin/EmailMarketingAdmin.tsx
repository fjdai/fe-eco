import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Email,
  Download,
  Send,
  People,
  Analytics,
  Campaign
} from '@mui/icons-material';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source: 'newsletter' | 'user';
  subscribed_at: string;
  is_active: boolean;
}

const EmailMarketingAdmin: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_subscribers: 0,
    newsletter_only: 0,
    registered_users: 0,
    recent_signups: 0
  });

  // Email campaign state
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [emailCampaign, setEmailCampaign] = useState({
    subject: '',
    content: '',
    includeUsers: true,
    recipients: [] as string[]
  });

  // Export dialog
  const [exportDialog, setExportDialog] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'csv' as 'csv' | 'json',
    includeUsers: true
  });

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/newsletter/subscribers', {
        headers: {
          'Authorization': typeof window !== 'undefined' && localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/admin/newsletter-stats', {
        headers: {
          'Authorization': typeof window !== 'undefined' && localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleExportEmails = async () => {
    try {
      const response = await fetch(`/api/newsletter/export-emails?format=${exportOptions.format}&includeUsers=${exportOptions.includeUsers}`, {
        headers: {
          'Authorization': typeof window !== 'undefined' && localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (exportOptions.format === 'csv') {
          // Download CSV
          const blob = new Blob([data.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `email_list_${new Date().getTime()}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          // Download JSON
          const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `email_list_${new Date().getTime()}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
        
        setExportDialog(false);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSendCampaign = async () => {
    if (!emailCampaign.subject || !emailCampaign.content) {
      alert('Please fill in subject and content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/newsletter/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': typeof window !== 'undefined' && localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({
          subject: emailCampaign.subject,
          content: emailCampaign.content,
          includeUsers: emailCampaign.includeUsers,
          recipients: emailCampaign.recipients.length > 0 ? emailCampaign.recipients : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Campaign sent successfully! Sent: ${result.sent}, Failed: ${result.failed}`);
        setCampaignDialog(false);
        setEmailCampaign({
          subject: '',
          content: '',
          includeUsers: true,
          recipients: []
        });
      } else {
        alert('Failed to send campaign');
      }
    } catch (error) {
      console.error('Campaign send failed:', error);
      alert('Failed to send campaign');
    } finally {
      setLoading(false);
    }
  };

  // Sample email content for demo
  const sampleEmailContent = `
    <h2>🎉 Special Offer Just for You!</h2>
    
    <p>Dear Valued Customer,</p>
    
    <p>We're excited to share our latest products and exclusive deals with you!</p>
    
    <h3>🔥 Featured Products:</h3>
    <ul>
      <li><strong>iPhone 15 Pro</strong> - Now $899.99 (was $999.99)</li>
      <li><strong>MacBook Pro 14"</strong> - Special price $1,799.99</li>
      <li><strong>Samsung Galaxy S24</strong> - Limited time offer $799.99</li>
    </ul>
    
    <h3>💡 Why Choose Our E-commerce Platform?</h3>
    <p>✅ Multiple payment methods (VNPay, PayPal)<br/>
    ✅ Live chat support with Facebook Messenger integration<br/>
    ✅ SEO-optimized product pages<br/>
    ✅ Secure checkout process<br/>
    ✅ Fast shipping worldwide</p>
    
    <p><a href="${window.location.origin}/products" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Shop Now 🛒</a></p>
    
    <p>Thank you for being part of our community!</p>
    
    <p>Best regards,<br/>
    The E-commerce Team</p>
    
    <hr/>
    <p style="font-size: 12px; color: #666;">
    This email was sent to newsletter subscribers and registered users who opted in for marketing communications.
    <br/>Contact: agilehcmue@gmail.com
    </p>
  `;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Email sx={{ mr: 1 }} />
        Email Marketing Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Subscribers
                  </Typography>
                  <Typography variant="h4">
                    {stats.total_subscribers}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Newsletter Only
                  </Typography>
                  <Typography variant="h4">
                    {stats.newsletter_only}
                  </Typography>
                </Box>
                <Email sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Registered Users
                  </Typography>
                  <Typography variant="h4">
                    {stats.registered_users}
                  </Typography>
                </Box>
                <Analytics sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recent Signups
                  </Typography>
                  <Typography variant="h4">
                    {stats.recent_signups}
                  </Typography>
                </Box>
                <Campaign sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => setCampaignDialog(true)}
          >
            Create Email Campaign
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => setExportDialog(true)}
          >
            Export Email List
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={fetchSubscribers}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </Grid>
      </Grid>

      {/* Subscribers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Email Subscribers
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Subscribed Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>{subscriber.name || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={subscriber.source} 
                        color={subscriber.source === 'newsletter' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={subscriber.is_active ? 'Active' : 'Inactive'} 
                        color={subscriber.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Email Campaign Dialog */}
      <Dialog open={campaignDialog} onClose={() => setCampaignDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Email Campaign</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailCampaign.subject}
                onChange={(e) => setEmailCampaign(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="🎉 Special Offer Just for You!"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Content (HTML)"
                multiline
                rows={10}
                value={emailCampaign.content}
                onChange={(e) => setEmailCampaign(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your email content here..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setEmailCampaign(prev => ({ ...prev, content: sampleEmailContent }))}
              >
                Use Sample Content
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={emailCampaign.includeUsers}
                    onChange={(e) => setEmailCampaign(prev => ({ ...prev, includeUsers: e.target.checked }))}
                  />
                }
                label="Include registered users who opted in for marketing"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCampaignDialog(false)}>Cancel</Button>
          <Button onClick={handleSendCampaign} variant="contained" disabled={loading}>
            {loading ? 'Sending...' : 'Send Campaign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
        <DialogTitle>Export Email List</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Export email addresses for external marketing tools like MailChimp, Mailjet, or GetResponse.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeUsers}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeUsers: e.target.checked }))}
                  />
                }
                label="Include registered users"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Format:</Typography>
              <Button
                variant={exportOptions.format === 'csv' ? 'contained' : 'outlined'}
                onClick={() => setExportOptions(prev => ({ ...prev, format: 'csv' }))}
                sx={{ mr: 1 }}
              >
                CSV
              </Button>
              <Button
                variant={exportOptions.format === 'json' ? 'contained' : 'outlined'}
                onClick={() => setExportOptions(prev => ({ ...prev, format: 'json' }))}
              >
                JSON
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportEmails} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmailMarketingAdmin;
