'use client';

import type { TUser } from '@acme/database/schema';
import type { UserType } from './type';
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
import UserForm from './user-form';

type EditUserDialogProps = {
  children: React.ReactNode;
  user: TUser;
};

export default function EditUserDialog({ children, user }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  async function putUser(data: UserType) {
    const response = await fetch(`/api/user/${user.id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User edited!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to edit user :(');
    },
  });

  async function deleteUser() {
    const response = await fetch(`/api/user/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  }

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted!');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete user :(');
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
          onDelete={deleteMutation.mutate}
        />
      </DialogContent>
    </Dialog>
  );
}
