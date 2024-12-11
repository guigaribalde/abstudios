import { db, eq } from '@acme/database/client';
import { EditSchoolSchema, School } from '@acme/database/schema';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const schoolId = (await params).id;
    const body = await req.json();
    const validatedData = EditSchoolSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ error: 'Validation error' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const school = await db
      .update(School)
      .set(validatedData.data)
      .where(eq(School.id, schoolId));

    return new Response(JSON.stringify(school), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating school:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update school',
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
    const schoolId = (await params).id;
    const school = await db.delete(School).where(eq(School.id, schoolId));
    return new Response(JSON.stringify(school), { status: 200 });
  } catch (error) {
    console.error('Error deleting school:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete school',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { status: 500 },
    );
  }
}
