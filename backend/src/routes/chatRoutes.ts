import { Router } from 'express';
import { handleChat, getChatHistory } from '../controllers/chatController';

const router = Router();

router.post('/chat', handleChat);
router.get('/chat-history', getChatHistory);

export default router;
