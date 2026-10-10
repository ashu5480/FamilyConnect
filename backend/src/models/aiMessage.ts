import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: 'USER' | 'ASSISTANT';
  content: string;
  toolCalls?: Record<string, unknown>[];
  createdAt: Date;
}

const aiMessageSchema = new Schema<IAIMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'AIConversation', required: true, index: true },
    role: {
      type: String,
      enum: ['USER', 'ASSISTANT'],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    toolCalls: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AIMessage: Model<IAIMessage> = (mongoose.models.AIMessage as Model<IAIMessage>) || mongoose.model<IAIMessage>('AIMessage', aiMessageSchema);