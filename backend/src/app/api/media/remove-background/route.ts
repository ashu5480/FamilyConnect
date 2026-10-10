import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Media } from '@/models/media';
import { BackgroundRemovalJob, RemovalJobStatus } from '@/models/backgroundRemovalJob';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { createBackgroundRemovalService } from '@/services/backgroundRemoval';
import { createMediaStorage } from '@/services/mediaStorage';

const removeBackgroundSchema = z.object({
  imageUrl: z.string().url(),
  eventId: z.string().optional(),
  familyId: z.string().optional(),
  originalMediaId: z.string().optional(),
  format: z.enum(['png', 'webp']).default('png'),
});

export async function POST(req: NextRequest) {
  return withAuth(async (authReq: AuthenticatedRequest) => {
    try {
      const body = await authReq.json();
      const data = removeBackgroundSchema.parse(body);

      await getDb();
      const service = createBackgroundRemovalService();
      const storage = createMediaStorage();

      const job = await BackgroundRemovalJob.create({
        userId: authReq.user!.userId,
        familyId: data.familyId as any,
        eventId: data.eventId as any,
        originalMediaId: data.originalMediaId as any,
        status: 'PROCESSING',
        provider: service.name,
        inputUrl: data.imageUrl,
      });

      try {
        const imageResponse = await fetch(data.imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        const result = await service.removeBackground(imageBuffer, {
          format: data.format,
        });

        const uploadResult = await storage.upload(
          result.buffer,
          `cutouts/${job._id}.${data.format}`,
          result.mimeType
        );

        job.status = RemovalJobStatus.COMPLETED;
        job.outputUrl = uploadResult.url;
        job.completedAt = new Date();
        await job.save();

        const media = await Media.create({
          eventId: data.eventId as any,
          userId: authReq.user!.userId,
          type: 'IMAGE',
          url: uploadResult.url,
          originalUrl: data.imageUrl,
          processedUrl: uploadResult.url,
          mimeType: result.mimeType,
          size: result.buffer.length,
          filename: `cutout-${job._id}.${data.format}`,
          isTransparent: true,
          storageProvider: uploadResult.provider,
        });

        return NextResponse.json({
          job: {
            id: job._id.toString(),
            status: job.status,
            provider: job.provider,
            inputUrl: job.inputUrl,
            outputUrl: job.outputUrl,
            completedAt: job.completedAt,
          },
          media: {
            id: media._id.toString(),
            url: media.url,
            processedUrl: media.processedUrl,
            isTransparent: media.isTransparent,
          },
        }, { status: 200 });
      } catch (processingError: any) {
        job.status = RemovalJobStatus.FAILED;
        job.error = processingError.message;
        await job.save();

        return NextResponse.json({
          error: 'Processing failed',
          message: processingError.message,
          jobId: job._id.toString(),
        }, { status: 500 });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
      }
      console.error('Remove background error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  })(req);
}