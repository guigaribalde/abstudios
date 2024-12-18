import type { NextRequest } from 'next/server';
import { and, db, eq, ilike, or } from '@acme/database/client';
import { CreateUserSchema, User } from '@acme/database/schema';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');
    const active = request.nextUrl.searchParams.get('active');

    let where;

    if (search || active) {
      where = and(
        search
          ? or(
              ilike(User.name, `%${search}%`),
              ilike(User.lastName, `%${search}%`),
            )
          : undefined,
        active ? eq(User.active, active === 'true') : undefined,
      );
    }

    const users = (await db.select().from(User).where(where));

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch users',
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
    const validatedData = CreateUserSchema.safeParse(body);

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

    const user = await db.insert(User).values(validatedData.data);

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create user',
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
