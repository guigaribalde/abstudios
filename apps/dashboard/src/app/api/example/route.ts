import { db } from '@acme/database/client';
import { CreateExampleSchema, Example } from '@acme/database/schema';

export async function GET(_request: Request) {
  try {
    const examples = await db.select().from(Example);

    return new Response(JSON.stringify(examples), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch examples',
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
    const validatedData = CreateExampleSchema.safeParse(body);

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

    const example = await db.insert(Example).values(validatedData.data);

    return new Response(JSON.stringify(example), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create example',
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
