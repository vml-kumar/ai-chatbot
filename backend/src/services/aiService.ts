import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const getAIResponse = async (
  message: string,
  provider: 'openai' | 'mistral'
): Promise<string> => {
  try {
    if (provider === 'openai') {
      const res = await axios.post<ChatResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data.choices?.[0]?.message?.content || 'No response from OpenAI.';
    } else {
      const res = await axios.post<ChatResponse>(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'user', content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5173/',
            'X-Title': 'AI Chatbot',
          },
        }
      );

      return res.data.choices?.[0]?.message?.content || 'No response from Mistral.';
    }
  } catch (error: any) {
    console.error('AI API Error:', error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.error?.message || 'AI response failed.'
    );
  }
};
