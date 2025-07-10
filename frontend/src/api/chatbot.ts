import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getBotResponse = async (
  message: string,
  provider: 'mistral' | 'openai'
): Promise<string> => {
  const res = await API.post('/chat', { message, provider });
  return res.data.reply;
};
