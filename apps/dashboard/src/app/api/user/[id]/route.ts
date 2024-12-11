import { db, eq } from '@acme/database/client';
import { EditUserSchema, User } from '@acme/database/schema';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id;
    const body = await req.json();
    const validatedData = EditUserSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ error: 'Validation error' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const user = await db
      .update(User)
      .set(validatedData.data)
      .where(eq(User.id, userId));

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update user',
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id;
    const user = await db.delete(User).where(eq(User.id, userId));

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete user',
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
