'use client';

import type { CreateSchoolSchema } from '@acme/database/schema';
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
import AddSchoolForm from './school-form';

type AddSchoolDialogProps = {
  children: React.ReactNode;
};

export default function AddSchoolDialog({ children }: AddSchoolDialogProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const postSchool = async (data: z.infer<typeof CreateSchoolSchema>) => {
    const response = await fetch('/api/school', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create school');
    }

    return response.json();
  };

  const { mutate: createSchool } = useMutation({
    mutationFn: postSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School created!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to create school');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
        </DialogHeader>

        <AddSchoolForm
          onSubmit={createSchool}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
