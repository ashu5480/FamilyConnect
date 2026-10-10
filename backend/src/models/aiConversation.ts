import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIConversation extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const aiConversationSchema = new Schema<IAIConversation>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const AIConversation: Model<IAIConversation> = (mongoose.models.AIConversation as Model<IAIConversation>) || mongoose.model<IAIConversation>('AIConversation', aiConversationSchema);