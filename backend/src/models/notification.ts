import mongoose, { Schema, Document, Model } from 'mongoose';

export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_DUE = 'TASK_DUE',
  TASK_COMPLETED = 'TASK_COMPLETED',
  MESSAGE = 'MESSAGE',
  MENTION = 'MENTION',
  NEW_RSVP = 'NEW_RSVP',
  NEW_PHOTO = 'NEW_PHOTO',
  EVENT_REMINDER = 'EVENT_REMINDER',
  SCHEDULE_REMINDER = 'SCHEDULE_REMINDER',
  BACKGROUND_REMOVAL_COMPLETED = 'BACKGROUND_REMOVAL_COMPLETED',
  INVITATION_CREATED = 'INVITATION_CREATED',
  SYSTEM = 'SYSTEM',
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  familyId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification: Model<INotification> = (mongoose.models.Notification as Model<INotification>) || mongoose.model<INotification>('Notification', notificationSchema);