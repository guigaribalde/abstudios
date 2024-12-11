'use client';

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
import type { UserType } from './type';
import UserForm from './user-form';

type EditUserDialogProps = {
  children: React.ReactNode;
  user: UserType;
};

export default function EditUserDialog({ children, user }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  async function putUser(data: UserType) {
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: putUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edit-user'] });
      toast.success('User edited!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to edit user :(');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <UserForm
          onSubmit={async (data: UserType) => {
            await mutation.mutateAsync(data);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          defaultValues={user}
        />
      </DialogContent>
    </Dialog>
  );
}
