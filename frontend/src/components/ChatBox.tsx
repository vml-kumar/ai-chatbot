import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { sendMessage, setProvider } from '@/redux/slices/chatSlice';

const ChatBox = () => {
  const dispatch = useAppDispatch();
  const { messages, input, provider, loading } = useAppSelector(
    (state) => state.chat
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage(input));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        AI Chatbot
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Select
          size="small"
          value={provider}
          onChange={(e) => dispatch(setProvider(e.target.value as any))}
        >
          <MenuItem value="mistral">Mistral (Free)</MenuItem>
          <MenuItem value="openai">OpenAI (GPT)</MenuItem>
        </Select>
      </Box>

      <Paper
        elevation={3}
        sx={{
          height: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          mb: 2,
          backgroundColor: '#1e1e1e',
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
            maxWidth="80%"
            px={2}
            py={1}
            borderRadius={2}
            bgcolor={msg.role === 'user' ? 'primary.main' : 'grey.800'}
            color="#fff"
          >
            <Typography variant="body2">{msg.content}</Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask something..."
          value={input}
          inputRef={inputRef}
          onChange={(e) =>
            dispatch({ type: 'chat/setInput', payload: e.target.value })
          }
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ border: '1px solid white', borderRadius: 2 }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ChatBox;
