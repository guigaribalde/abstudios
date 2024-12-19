import type { NextRequest } from 'next/server';
import { and, db, eq, ilike, or } from '@acme/database/client';
import { CreateSchoolSchema, Organization, School } from '@acme/database/schema';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');
    const active = request.nextUrl.searchParams.get('active');

    let where;

    if (search || active) {
      where = and(
        search
          ? or(
            ilike(Organization.name, `%${search}%`),
            ilike(School.name, `%${search}%`),
          )
          : undefined,
        active ? eq(School.active, active === 'true') : undefined,
      );
    }

    const response = (await db.select().from(School).where(where).leftJoin(Organization, eq(School.organizationId, Organization.id)));

    const schools = response.map(({ organization, school }) => ({
      ...school,
      organization: organization ?? null,
    }));

    return new Response(JSON.stringify(schools), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch schools',
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = CreateSchoolSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation error',
          details: validatedData.error.format(),
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const school = await db.insert(School).values(validatedData.data);

    return new Response(JSON.stringify(school), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create school',
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
