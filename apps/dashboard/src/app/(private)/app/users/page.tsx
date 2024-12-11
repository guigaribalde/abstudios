'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddUserDialog from './add-user-dialog';
import UsersPage from './users-page';

export default function Page() {
  return (
    <div className="flex size-full flex-col">
      <div className="flex w-full items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <AddUserDialog>
          <Button>
            <Plus />
            New User
          </Button>
        </AddUserDialog>
      </div>
      <UsersPage />
    </div>
  );
}
