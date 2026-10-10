import mongoose, { Schema, Document, Model } from 'mongoose';

export enum ExpenseCategory {
  VENUE = 'Venue',
  FOOD = 'Food',
  DECORATION = 'Decoration',
  PHOTOGRAPHY = 'Photography',
  TRANSPORT = 'Transport',
  CLOTHING = 'Clothing',
  GIFTS = 'Gifts',
  OTHER = 'Other',
}

export interface IExpense extends Document {
  eventId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: mongoose.Types.ObjectId;
  date: Date;
  receipt?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      required: true,
      index: true,
    },
    paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    receipt: { type: String },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Expense: Model<IExpense> = (mongoose.models.Expense as Model<IExpense>) || mongoose.model<IExpense>('Expense', expenseSchema);