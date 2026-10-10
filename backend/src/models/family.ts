import mongoose, { Schema, Document, Model } from 'mongoose';

export enum FamilyRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export interface IFamily extends Document {
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  createdBy: mongoose.Types.ObjectId;
  settings: {
    allowGuests: boolean;
    allowInvites: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const familySchema = new Schema<IFamily>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, trim: true },
    coverImage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    settings: {
      allowGuests: { type: Boolean, default: true },
      allowInvites: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const Family: Model<IFamily> = (mongoose.models.Family as Model<IFamily>) || mongoose.model<IFamily>('Family', familySchema);