import { db, eq } from '@acme/database/client';
import { EditShipmentSchema, Shipment } from '@acme/database/schema';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const shipmentId = (await params).id;
    const body = await req.json();
    const validatedData = EditShipmentSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ error: 'Validation error' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const shipment = await db
      .update(Shipment)
      .set(validatedData.data)
      .where(eq(Shipment.id, shipmentId));

    return new Response(JSON.stringify(shipment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating shipment:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update shipment',
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
    const shipmentId = (await params).id;
    const shipment = await db.delete(Shipment).where(eq(Shipment.id, shipmentId));

    return new Response(JSON.stringify(shipment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete shipment',
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
