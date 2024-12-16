import type { AddCourseFormType } from '@/app/(private)/app/videos/upload-form/add-course-form';
import type { AddVideoFormType } from '@/app/(private)/app/videos/upload-form/add-video-form';
import type { TCourse } from '@acme/database/schema';
import { and, db, eq } from '@acme/database/client';
import { Course, File, Season, Session, Video } from '@acme/database/schema';
import Mux from '@mux/mux-node';
import { z } from 'zod';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log(body);
    // const validatedData = UploadFormSchema.safeParse(body);
    //
    // if (!validatedData.success) {
    //   return new Response(
    //     JSON.stringify({
    //       error: 'Validation error',
    //       details: validatedData.error.format(),
    //     }),
    //     {
    //       status: 400,
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     },
    //   );
    // }
    const { video, course } = body as { video: AddVideoFormType; course: AddCourseFormType };

    const uuidSchema = z.string().uuid();
    const isUUID = uuidSchema.safeParse(course?.courseId).success;
    const createdVideo = await db.transaction(async (tx) => {
      let currentCourse: TCourse[] = [];
      if (isUUID) {
        currentCourse = await tx.select()
          .from(Course)
          .where(
            eq(Course.id, course.courseId),
          )
          .limit(1);
      }

      if (currentCourse.length === 0) {
        currentCourse = await tx.insert(Course).values({
          title: course.courseId,
          tags: course.tags,
          category: course.category,
          description: course.description,
        }).returning();
      }

      if (course.file) {
        await tx.insert(File).values({
          courseId: currentCourse[0].id,
          name: course.file.name,
          url: course.file.url,
          type: 'pdf',
        });
      }

      let currentSeason = await tx.select()
        .from(Season)
        .where(
          and(
            eq(Season.number, Number(course.seasonNumber)),
            eq(Season.courseId, currentCourse[0].id),
          ),
        )
        .limit(1);

      if (currentSeason.length === 0) {
        currentSeason = await tx.insert(Season).values({
          number: Number(course.seasonNumber),
          courseId: currentCourse[0].id,
        }).returning();
      }

      // TODO: from this point we need to delete episodes with the same number if they exist
      // in the future, when deleting the episode, we need also to remove from mux

      const currentSession = await tx.insert(Session).values({
        seasonId: currentSeason[0].id,
        number: Number(course.sessionNumber),
      }).returning();

      const upload = await mux.video.uploads.retrieve(video.uploadId);
      const asset = upload.asset_id ? await mux.video.assets.retrieve(upload.asset_id) : null;
      const playbackId = asset?.playback_ids?.[0].id || null;

      const createdVideo = await tx.insert(Video).values({
        url: video.url,
        title: video.title,
        subtitle: video.subtitle,
        uploadId: video.uploadId,
        sessionId: currentSession[0].id,
        playbackId,
      }).returning();

      return createdVideo;
    });

    return new Response(JSON.stringify({ video: createdVideo }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create video',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
