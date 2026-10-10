import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  eventId: mongoose.Types.ObjectId;
  channelId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  parentMessageId?: mongoose.Types.ObjectId;
  mentions: mongoose.Types.ObjectId[];
  attachments: string[];
  reactions: { emoji: string; count: number }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'FILE', 'SYSTEM'],
      default: 'TEXT',
    },
    parentMessageId: { type: Schema.Types.ObjectId, ref: 'Message' },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [{ type: String }],
    reactions: [
      {
        emoji: { type: String },
        count: { type: Number, default: 0 },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ eventId: 1, createdAt: -1 });

export const Message: Model<IMessage> = (mongoose.models.Message as Model<IMessage>) || mongoose.model<IMessage>('Message', messageSchema);