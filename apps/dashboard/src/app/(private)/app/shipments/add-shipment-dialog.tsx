'use client';

import type { CreateShipmentSchema } from '@acme/database/schema';
import type { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import ShipmentForm from './shipment-form';

type AddShipmentDialogProps = {
  children: React.ReactNode;
};

export default function AddShipmentDialog({ children }: AddShipmentDialogProps) {
  const [open, setOpen] = useState(false);
  async function postShipment(data: z.infer<typeof CreateShipmentSchema>) {
    const response = await fetch('/api/shipment', {
      method: 'POST',
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
    mutationFn: postShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment created!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to create shipment :(');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Shipment</DialogTitle>
        </DialogHeader>
        <ShipmentForm
          onSubmit={async (data: z.infer<typeof CreateShipmentSchema>) => {
            await mutation.mutateAsync(data);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
