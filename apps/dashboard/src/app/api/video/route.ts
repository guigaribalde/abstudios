import { db, eq } from '@acme/database/client';
import { Course, Season, Session, Video } from '@acme/database/schema';

export async function GET(_req: Request) {
  try {
    const videos = await db.select()
      .from(Video)
      .leftJoin(Session, eq(Video.sessionId, Session.id))
      .leftJoin(Season, eq(Session.seasonId, Season.id))
      .leftJoin(Course, eq(Season.courseId, Course.id));

    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching Mux upload:', error);
    return Response.json(
      { error: 'Failed to fetch upload status' },
      { status: 500 },
    );
  }
}
