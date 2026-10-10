import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Task } from '@/models/task';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
});

function getIds(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/');
  return { eventId: parts[parts.length - 3], taskId: parts[parts.length - 1] };
}

export const PATCH = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { eventId, taskId } = getIds(req);
    const body = await req.json();
    const data = updateTaskSchema.parse(body);

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId as any, eventId: eventId as any },
      data,
      { new: true }
    ).lean();

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      task: {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo?.toString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { eventId, taskId } = getIds(req);

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const task = await Task.findOneAndDelete({ _id: taskId as any, eventId: eventId as any });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
