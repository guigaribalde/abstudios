'use client';

import type { EditOrganizationSchema, TOrganization } from '@acme/database/schema';
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
import EditOrganizationForm from './organization-form';

type EditOrganizationDialogProps = {
  children: React.ReactNode;
  organization: TOrganization;
};

export default function EditOrganizationDialog({ children, organization }: EditOrganizationDialogProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const putOrganization = async (data: z.infer<typeof EditOrganizationSchema>) => {
    const response = await fetch(`/api/organization/${organization.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to edit organization');
    }

    return response.json();
  };

  const requestDeleteOrganization = async () => {
    const response = await fetch(`/api/organization/${organization.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete organization');
    }

    return response.json();
  };

  const { mutate: editOrganization } = useMutation({
    mutationFn: putOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization updated!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to update organization');
    },
  });

  const { mutate: deleteOrganization } = useMutation({
    mutationFn: requestDeleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization deleted!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete organization');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
        </DialogHeader>

        <EditOrganizationForm
          onSubmit={editOrganization}
          defaultValues={organization}
          onCancel={() => setOpen(false)}
          onDelete={deleteOrganization}
        />
      </DialogContent>
    </Dialog>
  );
}
