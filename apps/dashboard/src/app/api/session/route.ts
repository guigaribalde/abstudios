import type { NextRequest } from 'next/server';
import { and, db, eq } from '@acme/database/client';
import { Season, Session } from '@acme/database/schema';

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get('courseId');
    const seasonNumber = request.nextUrl.searchParams.get('seasonNumber');

    let where;

    if (courseId || seasonNumber) {
      where = and(
        courseId ? eq(Season.courseId, courseId) : undefined,
        seasonNumber ? eq(Season.number, Number(seasonNumber)) : undefined,
      );
    }

    const response = (await db.select().from(Session).where(where).leftJoin(Season, eq(Season.id, Session.seasonId)));

    const sessions = response.map(({ session }) => (session));

    return new Response(JSON.stringify(sessions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch sessions',
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
