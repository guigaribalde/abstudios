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
      <DialogContent className="flex h-[600px] max-w-4xl flex-col">
        <DialogHeader className="flex h-fit">
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>

        <UploadForm
          onSubmit={async () => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
