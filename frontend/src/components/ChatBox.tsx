import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Paper,
  Container,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  sendMessage,
  setInput,
  setProvider,
} from '@/redux/slices/chatSlice';

const ChatBox = () => {
  const dispatch = useAppDispatch();
  const { messages, input, provider, loading } = useAppSelector(
    (state) => state.chat
  );

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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, minHeight: '80vh' }}>
        <Typography variant="h4" gutterBottom>
          AI Chatbot
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Select
            size="small"
            value={provider}
            onChange={(e) =>
              dispatch(setProvider(e.target.value as 'openai' | 'mistral'))
            }
          >
            <MenuItem value="mistral">Mistral (Free)</MenuItem>
            <MenuItem value="openai">OpenAI (GPT)</MenuItem>
          </Select>
        </Box>

        <Box
          sx={{
            height: '50vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 3,
            border: '1px solid #ddd',
            borderRadius: 2,
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              sx={{
                maxWidth: '75%',
                bgcolor: msg.role === 'user' ? '#1976d2' : '#eee',
                color: msg.role === 'user' ? 'white' : 'black',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              {msg.content}
            </Box>
          ))}

          {loading && (
            <Box
              alignSelf="flex-start"
              sx={{
                maxWidth: '75%',
                bgcolor: '#eee',
                color: 'black',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontStyle: 'italic',
                opacity: 0.7,
              }}
            >
              AI is thinking...
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            color="primary"
            sx={{ border: '1px solid #ccc', borderRadius: 2 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBox;
