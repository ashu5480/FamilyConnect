import mongoose, { Schema, Document, Model } from 'mongoose';

export enum EventType {
  WEDDING = 'Wedding',
  ENGAGEMENT = 'Engagement',
  BIRTHDAY = 'Birthday',
  ANNIVERSARY = 'Anniversary',
  POOJA = 'Pooja',
  HOUSEWARMING = 'Housewarming',
  BABY_SHOWER = 'Baby Shower',
  FAMILY_REUNION = 'Family Reunion',
  OTHER = 'Other',
}

export interface IEvent extends Document {
  familyId: mongoose.Types.ObjectId;
  name: string;
  type: EventType;
  coverImage?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    type: {
      type: String,
      enum: Object.values(EventType),
      required: true,
      index: true,
    },
    coverImage: { type: String },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> = (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', eventSchema);