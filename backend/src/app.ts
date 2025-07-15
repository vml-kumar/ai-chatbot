import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigin = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST'],
  })
);

app.use(express.json());

app.use('/api', chatRoutes);

export default app;
