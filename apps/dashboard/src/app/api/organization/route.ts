import type { NextRequest } from 'next/server';
import { and, db, eq, ilike } from '@acme/database/client';
import { CreateOrganizationSchema, Organization } from '@acme/database/schema';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');
    const active = request.nextUrl.searchParams.get('active');

    let where;

    if (search || active) {
      where = and(
        search
          ? ilike(Organization.name, `%${search}%`)

          : undefined,
        active ? eq(Organization.active, active === 'true') : undefined,
      );
    }

    const organizations = (await db.select().from(Organization).where(where));

    return new Response(JSON.stringify(organizations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch organizations',
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
    const validatedData = CreateOrganizationSchema.safeParse(body);

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

    const organization = await db.insert(Organization).values(validatedData.data);

    return new Response(JSON.stringify(organization), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create organization',
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
