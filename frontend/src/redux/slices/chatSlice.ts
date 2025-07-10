import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

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
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  provider: 'mistral',
  input: ''
};

export const sendMessage = createAsyncThunk<
  string,
  string,
  { state: { chat: ChatState } }
>('chat/sendMessage', async (message, { getState, rejectWithValue }) => {
  const provider = getState().chat.provider;

  try {
    const res = await axios.post('/chat', {
      message,
      provider,
    });
    return res.data.reply;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Something went wrong');
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
      });
  },
});

export const { setProvider, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
