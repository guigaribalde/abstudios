'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import UploadForm from './upload-form';

type AddVideoDialogProps = {
  children: React.ReactNode;
};

export default function AddVideoDialog({ children }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>

        <UploadForm
          onSubmit={async (data) => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
