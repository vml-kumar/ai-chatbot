import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

app.use('/api', chatRoutes);

export default app;
