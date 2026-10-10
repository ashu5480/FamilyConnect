import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchedule extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  location?: string;
  description?: string;
  organizer?: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  reminder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reminder: { type: Number },
  },
  { timestamps: true }
);

export const Schedule: Model<ISchedule> = (mongoose.models.Schedule as Model<ISchedule>) || mongoose.model<ISchedule>('Schedule', scheduleSchema);