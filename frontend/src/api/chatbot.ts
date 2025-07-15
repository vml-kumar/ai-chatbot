import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getBotResponse = async (
  message: string,
  provider: 'mistral' | 'openai'
): Promise<string> => {
  const res = await API.post('/chat', { message, provider });
  return res.data.reply;
};
