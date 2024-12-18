import type { NextRequest } from 'next/server';
import { db, eq } from '@acme/database/client';
import { Season } from '@acme/database/schema';

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get('courseId');

    const where = courseId ? eq(Season.courseId, courseId) : undefined;

    const seasons = (await db.select().from(Season).where(where));

    return new Response(JSON.stringify(seasons), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch seasons',
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
