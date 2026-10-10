import mongoose, { Schema, Document, Model } from 'mongoose';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface IMedia extends Document {
  eventId: mongoose.Types.ObjectId;
  albumId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  originalUrl: string;
  processedUrl?: string;
  mimeType: string;
  width?: number;
  height?: number;
  size: number;
  filename: string;
  caption?: string;
  isTransparent: boolean;
  storageProvider: 'vercel-blob' | 'cloudinary' | 's3';
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    albumId: { type: Schema.Types.ObjectId, ref: 'Album' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(MediaType),
      required: true,
      index: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    originalUrl: { type: String, required: true },
    processedUrl: { type: String },
    mimeType: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    size: { type: Number, required: true },
    filename: { type: String, required: true },
    caption: { type: String, trim: true },
    isTransparent: { type: Boolean, default: false, index: true },
    storageProvider: {
      type: String,
      enum: ['vercel-blob', 'cloudinary', 's3'],
      required: true,
    },
  },
  { timestamps: true }
);

mediaSchema.index({ eventId: 1, type: 1, createdAt: -1 });

export const Media: Model<IMedia> = (mongoose.models.Media as Model<IMedia>) || mongoose.model<IMedia>('Media', mediaSchema);