import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { RootState } from '@/redux/store';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  provider: 'openai' | 'mistral';
  input: string;
  chatLoaded: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  provider: 'mistral',
  input: '',
  chatLoaded: false,
};

export const sendMessage = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('chat/sendMessage', async (message, { getState, rejectWithValue }) => {
  const { provider, input } = getState().chat;
  const { uid, email } = getState().auth;
  try {
    const res = await axios.post('/chat', {
      message,
      provider,
      userId: uid || null,
      email: email || null,
    });
    return res.data.reply;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Something went wrong');
  }
});

export const fetchChatHistory = createAsyncThunk<
  Message[],
  string, // userId
  { state: RootState }
>('chat/fetchHistory', async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/chat-history?userId=${userId}`);
    return res.data.messages;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to load history');
  }
});


const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setProvider(state, action: PayloadAction<'openai' | 'mistral'>) {
      state.provider = action.payload;
    },
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    resetChat(state) {
      state.messages = [];
      state.error = null;
      state.chatLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({ role: 'user', content: action.meta.arg });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'ai', content: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.chatLoaded = true;
      });
  },
});

export const { setProvider, setInput, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
