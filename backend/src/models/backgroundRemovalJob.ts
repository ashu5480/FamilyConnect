import mongoose, { Schema, Document, Model } from 'mongoose';

export enum RemovalJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface IBackgroundRemovalJob extends Document {
  userId: mongoose.Types.ObjectId;
  familyId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  originalMediaId?: mongoose.Types.ObjectId;
  status: RemovalJobStatus;
  provider: string;
  inputUrl: string;
  outputUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

const backgroundRemovalJobSchema = new Schema<IBackgroundRemovalJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    originalMediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
    status: {
      type: String,
      enum: Object.values(RemovalJobStatus),
      default: RemovalJobStatus.PENDING,
      index: true,
    },
    provider: { type: String, required: true },
    inputUrl: { type: String, required: true },
    outputUrl: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

export const BackgroundRemovalJob: Model<IBackgroundRemovalJob> =
  (mongoose.models.BackgroundRemovalJob as Model<IBackgroundRemovalJob>) ||
  mongoose.model<IBackgroundRemovalJob>(
    'BackgroundRemovalJob',
    backgroundRemovalJobSchema
  );