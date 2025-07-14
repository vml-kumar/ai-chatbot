import { Request, Response } from 'express';
import { getAIResponse } from '../services/aiService';
import { Chat } from '../models/chat.model';

export const handleChat = async (req: Request, res: Response) => {
  const { message, provider, userId, email } = req.body;

  if (!message || !provider) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get AI reply
    const reply = await getAIResponse(message, provider);

    // Save both user and AI messages to MongoDB (only if logged in)
    if (userId) {
      await Chat.create([
        {
          userId,
          email,
          role: 'user',
          content: message,
          provider,
        },
        {
          userId,
          email,
          role: 'ai',
          content: reply,
          provider,
        },
      ]);
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Failed to get AI response' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const messages = await Chat.find({ userId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
};
