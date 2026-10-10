import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IDocument extends MongooseDocument {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  originalUrl: string;
  mimeType: string;
  size: number;
  filename: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    originalUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    filename: { type: String, required: true },
    category: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const Document: Model<IDocument> = (mongoose.models.Document as Model<IDocument>) || mongoose.model<IDocument>('Document', documentSchema);