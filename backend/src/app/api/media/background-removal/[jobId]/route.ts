import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { BackgroundRemovalJob } from '@/models/backgroundRemovalJob';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const jobId = req.nextUrl.pathname.split('/').pop()!;
    await getDb();

    const job = await BackgroundRemovalJob.findOne({
      _id: jobId,
      userId: req.user!.userId,
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      job: {
        id: job._id.toString(),
        status: job.status,
        provider: job.provider,
        inputUrl: job.inputUrl,
        outputUrl: job.outputUrl,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      },
    });
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});