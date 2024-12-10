'use client';

import type { EditSchoolSchema } from '@acme/database/schema';
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
import EditSchoolForm from './school-form';

type EditSchoolDialogProps = {
  children: React.ReactNode;
  school: z.infer<typeof EditSchoolSchema>;
};

export default function EditSchoolDialog({ children, school }: EditSchoolDialogProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const putSchool = async (data: z.infer<typeof EditSchoolSchema>) => {
    const response = await fetch(`/api/school/${school.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to edit school');
    }

    return response.json();
  };

  const { mutate: editSchool } = useMutation({
    mutationFn: putSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School updated!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to update school');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
        </DialogHeader>

        <EditSchoolForm
          onSubmit={editSchool}
          defaultValues={school}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
