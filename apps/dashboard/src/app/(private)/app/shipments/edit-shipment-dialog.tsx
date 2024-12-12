'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { EditShipmentSchema, TShipment } from '@acme/database/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import ShipmentForm from './shipment-form';

type EditShipmentDialogProps = {
  children: React.ReactNode;
  shipment: TShipment;
};

export default function EditShipmentDialog({ children, shipment }: EditShipmentDialogProps) {
  const [open, setOpen] = useState(false);
  async function putShipment(data: z.infer<typeof EditShipmentSchema>) {
    const response = await fetch(`/api/shipment/${shipment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create shipment');
    }

    return response.json();
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: putShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment edited!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to edit shipment :(');
    },
  });

  async function deleteShipment() {
    const response = await fetch(`/api/shipment/${shipment.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete shipment');
    }

    return response.json();
  }

  const deleteMutation = useMutation({
    mutationFn: deleteShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment deleted!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete shipment :(');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Shipment</DialogTitle>
        </DialogHeader>
        <ShipmentForm
          onSubmit={async (data: z.infer<typeof EditShipmentSchema>) => {
            await mutation.mutateAsync(data);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          defaultValues={shipment}
          onDelete={deleteMutation.mutate}
        />
      </DialogContent>
    </Dialog>
  );
}
