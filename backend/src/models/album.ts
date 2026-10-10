import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlbum extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  coverImage?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    coverImage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Album: Model<IAlbum> = (mongoose.models.Album as Model<IAlbum>) || mongoose.model<IAlbum>('Album', albumSchema);