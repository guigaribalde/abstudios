'use client';

import type { UploadFormType } from './upload-form';
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
import UploadForm from './upload-form';

type AddVideoDialogProps = {
  children: React.ReactNode;
};

export default function AddVideoDialog({ children }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false);
  async function postExample(data: UploadFormType) {
    const response = await fetch('/api/video/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create course');
    }

    return response.json();
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Example created!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to create example :(');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-w-4xl flex-col">
        <DialogHeader className="flex h-fit">
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>

        <UploadForm
          onSubmit={async (data) => {
            await mutation.mutateAsync(data);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
