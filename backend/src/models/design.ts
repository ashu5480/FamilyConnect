import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDesign extends Document {
  eventId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'INVITATION' | 'EVENT_COVER';
  template?: string;
  background?: string;
  elements: {
    type: 'TEXT' | 'IMAGE';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    zIndex: number;
  }[];
  previewUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const designSchema = new Schema<IDesign>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['INVITATION', 'EVENT_COVER'],
      required: true,
      index: true,
    },
    template: { type: String, trim: true },
    background: { type: String },
    elements: [
      {
        type: { type: String, enum: ['TEXT', 'IMAGE'], required: true },
        content: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        rotation: { type: Number, default: 0 },
        opacity: { type: Number, default: 1, min: 0, max: 1 },
        fontSize: { type: Number },
        color: { type: String },
        fontFamily: { type: String },
        textAlign: { type: String, enum: ['left', 'center', 'right'] },
        zIndex: { type: Number, default: 0 },
      },
    ],
    previewUrl: { type: String },
  },
  { timestamps: true }
);

export const Design: Model<IDesign> = (mongoose.models.Design as Model<IDesign>) || mongoose.model<IDesign>('Design', designSchema);