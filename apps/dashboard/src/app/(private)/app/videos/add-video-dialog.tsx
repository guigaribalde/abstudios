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

export const VIDEO_ID_KEY = 'uploaded_video_id';
export const PDF_PATH_KEY = 'uploaded_pdf_path';

type AddVideoDialogProps = {
  children: React.ReactNode;
};

export default function AddVideoDialog({ children }: AddVideoDialogProps) {
  const { mutateAsync: cleanUpMutation } = useMutation({
    mutationFn: () => {
      const videoId = localStorage.getItem(VIDEO_ID_KEY);
      const pdfPath = localStorage.getItem(PDF_PATH_KEY);
      if (!videoId && !pdfPath) {
        return new Promise(resolve => resolve(null));
      }
      return fetch('/api/video', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, pdfPath }),
      });
    },
    onSuccess: () => {
      localStorage.removeItem(VIDEO_ID_KEY);
      localStorage.removeItem(PDF_PATH_KEY);
    },
  });

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
      localStorage.removeItem(VIDEO_ID_KEY);
      localStorage.removeItem(PDF_PATH_KEY);
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Example created!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to create example :(');
    },
  });

  const handleCancel = () => {
    cleanUpMutation();
    setOpen(false);
  };

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
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
