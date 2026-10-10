import mongoose, { Schema, Document, Model } from 'mongoose';

export enum EventMemberRole {
  ORGANIZER = 'ORGANIZER',
  CO_HOST = 'CO_HOST',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export interface IEventMember extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: EventMemberRole;
  createdAt: Date;
  updatedAt: Date;
}

const eventMemberSchema = new Schema<IEventMember>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: {
      type: String,
      enum: Object.values(EventMemberRole),
      default: EventMemberRole.MEMBER,
    },
  },
  { timestamps: true }
);

eventMemberSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const EventMember: Model<IEventMember> = (mongoose.models.EventMember as Model<IEventMember>) || mongoose.model<IEventMember>('EventMember', eventMemberSchema);