import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITaskComment extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskCommentSchema = new Schema<ITaskComment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const TaskComment: Model<ITaskComment> = (mongoose.models.TaskComment as Model<ITaskComment>) || mongoose.model<ITaskComment>('TaskComment', taskCommentSchema);