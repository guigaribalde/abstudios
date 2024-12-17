import { and, db, eq, ilike, or } from '@acme/database/client';
import { CreateShipmentSchema, School, Shipment } from '@acme/database/schema';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');
    const status = request.nextUrl.searchParams.get('status');

    let where;

    if (search || status) {
      where = and(
        search
          ? or(
            ilike(School.name, `%${search}%`),
            ilike(Shipment.contact, `%${search}%`),
          )
          : undefined,
        status ? ilike(Shipment.status, status) : undefined,
      );
    }

    const shipment = (await (await db.select().from(Shipment).leftJoin(School, eq(Shipment.schoolId, School.id)).where(where)));

    return new Response(JSON.stringify(shipment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch shipments',
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
    const validatedData = CreateShipmentSchema.safeParse(body);

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

    const shipment = await db.insert(Shipment).values(validatedData.data);

    return new Response(JSON.stringify(shipment), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create shipment',
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
