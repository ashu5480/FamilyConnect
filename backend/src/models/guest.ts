import mongoose, { Schema, Document, Model } from 'mongoose';

export enum RsvpStatus {
  YES = 'YES',
  NO = 'NO',
  MAYBE = 'MAYBE',
  PENDING = 'PENDING',
}

export interface IGuest extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  plusOne?: number;
  side: 'BRIDE' | 'GROOM' | 'BOTH' | 'FAMILY';
  rsvp: RsvpStatus;
  accommodation?: string;
  transportation?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const guestSchema = new Schema<IGuest>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    plusOne: { type: Number, default: 0 },
    side: {
      type: String,
      enum: ['BRIDE', 'GROOM', 'BOTH', 'FAMILY'],
      default: 'BOTH',
      index: true,
    },
    rsvp: {
      type: String,
      enum: Object.values(RsvpStatus),
      default: RsvpStatus.PENDING,
      index: true,
    },
    accommodation: { type: String, trim: true },
    transportation: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Guest: Model<IGuest> = (mongoose.models.Guest as Model<IGuest>) || mongoose.model<IGuest>('Guest', guestSchema);