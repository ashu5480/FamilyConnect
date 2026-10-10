import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { Event } from '@/models/event';
import { EventMember } from '@/models/eventMember';
import { Task } from '@/models/task';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get('status');
    const query: any = { eventId: eventId as any };
    if (status && status !== 'ALL') query.status = status;

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ tasks: tasks.map(t => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      assignedTo: t.assignedTo?.toString(),
      createdBy: t.createdBy.toString(),
      attachments: t.attachments,
    })) });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createTaskSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const task = await Task.create({
      ...data,
      eventId: eventId as any,
      createdBy: req.user!.userId,
      status: 'TODO',
      attachments: [],
    });

    return NextResponse.json({
      task: {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo?.toString(),
        createdBy: task.createdBy.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});