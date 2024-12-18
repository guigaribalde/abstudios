import { db, eq } from '@acme/database/client';
import { EditOrganizationSchema, Organization } from '@acme/database/schema';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const organizationId = (await params).id;
    const body = await req.json();
    const validatedData = EditOrganizationSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ error: 'Validation error' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const organization = await db
      .update(Organization)
      .set(validatedData.data)
      .where(eq(Organization.id, organizationId));

    return new Response(JSON.stringify(organization), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update organization',
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
    const organizationId = (await params).id;
    const organization = await db.delete(Organization).where(eq(Organization.id, organizationId));
    return new Response(JSON.stringify(organization), { status: 200 });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete organization',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { status: 500 },
    );
  }
}
