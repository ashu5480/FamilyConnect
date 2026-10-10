import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChannel extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  isPrivate: boolean;
  allowedRoles: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const channelSchema = new Schema<IChannel>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    isPrivate: { type: Boolean, default: false },
    allowedRoles: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

channelSchema.index({ eventId: 1, slug: 1 }, { unique: true });

export const Channel: Model<IChannel> = (mongoose.models.Channel as Model<IChannel>) || mongoose.model<IChannel>('Channel', channelSchema);