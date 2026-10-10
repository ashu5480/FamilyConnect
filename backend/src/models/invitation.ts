import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvitation extends Document {
  eventId: mongoose.Types.ObjectId;
  title: string;
  message?: string;
  designId?: mongoose.Types.ObjectId;
  shareLink: string;
  allowRsvp: boolean;
  expiresAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    designId: { type: Schema.Types.ObjectId, ref: 'Design' },
    shareLink: { type: String, required: true, unique: true, index: true },
    allowRsvp: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export const Invitation: Model<IInvitation> = (mongoose.models.Invitation as Model<IInvitation>) || mongoose.model<IInvitation>('Invitation', invitationSchema);