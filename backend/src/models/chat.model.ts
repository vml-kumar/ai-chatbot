import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false }, // optional (guest users)
    email: { type: String, required: false },
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    provider: { type: String, enum: ['openai', 'mistral'], required: true },
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);
