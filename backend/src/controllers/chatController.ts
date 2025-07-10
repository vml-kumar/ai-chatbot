import { Request, Response } from 'express';
import { getAIResponse } from '../services/aiService';

export const handleChat = async (req: Request, res: Response) => {
  const { message, provider } = req.body;

  if (!message || !provider) {
    return res.status(400).json({ error: 'Message and provider are required' });
  }

  try {
    const reply = await getAIResponse(message, provider);
    res.json({ reply });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};
