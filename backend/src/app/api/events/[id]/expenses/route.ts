import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Expense } from '@/models/expense';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createExpenseSchema = z.object({
  title: z.string().min(1).max(200),
  amount: z.number().min(0),
  category: z.enum(['Venue', 'Food', 'Decoration', 'Photography', 'Transport', 'Clothing', 'Gifts', 'Other']),
  paidBy: z.string(),
  date: z.string().optional(),
  receipt: z.string().optional(),
  notes: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const expenses = await Expense.find({ eventId: eventId as any }).sort({ date: -1 }).lean();
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      totalSpent,
      expenses: expenses.map(e => ({
        id: e._id.toString(),
        title: e.title,
        amount: e.amount,
        category: e.category,
        paidBy: e.paidBy.toString(),
        date: e.date,
        receipt: e.receipt,
        notes: e.notes,
      })),
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createExpenseSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const expense = await Expense.create({
      ...data,
      eventId: eventId as any,
      date: data.date ? new Date(data.date) : new Date(),
      createdBy: req.user!.userId,
    });

    return NextResponse.json({
      expense: {
        id: expense._id.toString(),
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        paidBy: expense.paidBy.toString(),
        date: expense.date,
        receipt: expense.receipt,
        notes: expense.notes,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});