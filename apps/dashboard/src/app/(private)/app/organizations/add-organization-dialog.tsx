'use client';

import type { CreateOrganizationSchema } from '@acme/database/schema';
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
import AddOrganizationForm from './organization-form';

type AddOrganizationDialogProps = {
  children: React.ReactNode;
};

export default function AddOrganizationDialog({ children }: AddOrganizationDialogProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const postOrganization = async (data: z.infer<typeof CreateOrganizationSchema>) => {
    const response = await fetch('/api/organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create organization');
    }

    return response.json();
  };

  const { mutate: createOrganization } = useMutation({
    mutationFn: postOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization created!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to create organization');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Organization</DialogTitle>
        </DialogHeader>

        <AddOrganizationForm
          onSubmit={createOrganization}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
