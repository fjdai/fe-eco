import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Badge,
  Slide,
  Fab,
  Chip,
} from '@mui/material';
import {
  Chat,
  Close,
  Send,
  SupportAgent,
  Minimize,
  Phone,
  Facebook
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 100,
  right: 20,
  width: 350,
  height: 500,
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 40px)',
    height: 'calc(100vh - 120px)',
    bottom: 80,
    right: 20,
    left: 20,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  backgroundColor: '#f5f5f5',
}));

const MessageBubble = styled(Box)<{ isOwn?: boolean }>(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.spacing(2),
  margin: theme.spacing(0.5, 0),
  backgroundColor: isOwn ? theme.palette.primary.main : 'white',
  color: isOwn ? 'white' : theme.palette.text.primary,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  boxShadow: theme.shadows[1],
}));

const ChatFab = styled(Fab)(() => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 1300,
}));

interface ChatMessage {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
  sender: string;
}

const LiveChatSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    'Hi! How can I help you today?',
    'I need help with my order',
    'Product information needed',
    'Technical support',
    'Billing question'
  ];

  const autoReplies = [
    "Hi! I'm Sarah from customer support. How can I assist you today?",
    "Thanks for reaching out! I'll be happy to help you with that.",
    "Let me check that information for you. Please give me a moment.",
    "Is there anything else I can help you with?",
    "Have a great day! Feel free to reach out if you need any more assistance."
  ];

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      // Send welcome message
      setTimeout(() => {
        addMessage(autoReplies[0], false, 'Sarah Wilson');
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, isOwn: boolean, sender: string = 'You') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isOwn,
      timestamp: new Date(),
      sender
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (!isOwn && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage(message, true);
      setMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Auto-reply
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        addMessage(randomReply, false, 'Sarah Wilson');
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  // Facebook Messenger integration
  const openFacebookMessenger = () => {
    window.open('https://m.me/your-facebook-page', '_blank');
  };

  return (
    <>
      {/* Chat Window */}
      <Slide direction="up" in={isOpen && !isMinimized} mountOnEnter unmountOnExit>
        <ChatContainer>
          {/* Header */}
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <SupportAgent />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Customer Support
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Online • Typically replies instantly
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <IconButton color="inherit" onClick={minimizeChat} size="small">
                <Minimize />
              </IconButton>
              <IconButton color="inherit" onClick={closeChat} size="small">
                <Close />
              </IconButton>
            </Box>
          </ChatHeader>

          {/* Messages */}
          <MessagesContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
                  }}
                >
                  <MessageBubble isOwn={msg.isOwn}>
                    <Typography variant="body2">
                      {msg.text}
                    </Typography>
                  </MessageBubble>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mx: 1 }}>
                    {msg.sender} • {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <SupportAgent fontSize="small" />
                  </Avatar>
                  <Chip label="Sarah is typing..." size="small" />
                </Box>
              )}
            </Box>
            <div ref={messagesEndRef} />
          </MessagesContainer>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick replies:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {quickReplies.slice(1).map((reply, index) => (
                  <Chip
                    key={index}
                    label={reply}
                    size="small"
                    clickable
                    onClick={() => {
                      addMessage(reply, true);
                      setTimeout(() => {
                        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
                        addMessage(randomReply, false, 'Sarah Wilson');
                      }, 1000);
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Message Input */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <Send />
              </Button>
            </Box>
            
            {/* Alternative Contact Methods */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Other ways to reach us:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={openFacebookMessenger}>
                  <Facebook color="primary" />
                </IconButton>
                <IconButton size="small" href="tel:+1234567890">
                  <Phone color="primary" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </ChatContainer>
      </Slide>

      {/* Minimized Chat Bar */}
      <Slide direction="up" in={isMinimized} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            p: 2,
            zIndex: 1300,
            cursor: 'pointer',
            minWidth: 200,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
          onClick={() => setIsMinimized(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>
                <SupportAgent fontSize="small" />
              </Avatar>
              <Typography variant="body2">
                Customer Support
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={(e) => { e.stopPropagation(); closeChat(); }} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* Chat FAB */}
      {!isOpen && (
        <ChatFab
          color="primary"
          onClick={openChat}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Chat />
          </Badge>
        </ChatFab>
      )}
    </>
  );
};

export default LiveChatSupport;
