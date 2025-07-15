import React, { useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Paper,
  Container,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  sendMessage,
  setInput,
  setProvider,
  fetchChatHistory,
} from '@/redux/slices/chatSlice';
import promptSuggestions from '@/data/promptSuggestions';
import { keyframes } from '@emotion/react';

const ChatBox = () => {
  const dispatch = useAppDispatch();
  const { messages, input, provider, loading, chatLoaded } = useAppSelector(
    (state) => state.chat
  );
  const { uid } = useAppSelector((state) => state.auth);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage(input));
      dispatch(setInput(''));
    }
  };

  const handleSuggestionClick = (text: string) => {
    dispatch(setInput(text));
  };

  const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
  `;

  useEffect(() => {
    if (uid) {
      dispatch(fetchChatHistory(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const randomSuggestions = useMemo(() => {
    return promptSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);

  const shouldShowPrompts =
    (!uid && messages.length === 0) || (uid && chatLoaded && messages.length === 0);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, minHeight: '80vh' }}>
        {/* Top Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold"></Typography>
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

        {/* Chat Area */}
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
          {shouldShowPrompts && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                🤖 Try one of these prompts:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {randomSuggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    clickable
                    sx={{
                      cursor: 'pointer',
                      animation: `${fadeIn} 0.4s ease-out`,
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'both',
                    }}
                  />

                ))}
              </Box>
            </Box>
          )}

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

        {/* Input */}
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
