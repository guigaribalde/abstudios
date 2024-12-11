'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import UserImageEmptyState from '@/lib/assets/empty-states/user-image';
import { useQuery } from '@tanstack/react-query';
import { Check, Edit, Filter, Loader2, Search, Trash, X } from 'lucide-react';
import { useState } from 'react';
import EditUserDialog from './edit-user-dialog';
import type { TempUserType } from './type';

const mapStatus: Record<string, string> = {
  true: 'Active',
  false: 'Inactive',
  all: 'All Status',
};

const mapRole: Record<string, string> = {
  educator: 'Educator',
  admin: 'Admin',
  super_admin: 'Super Admin',
  all: 'All Roles',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<string>('all');
  const [role, setRole] = useState<string>('all');
  const debouncedSearch = useDebounce(search, 500);

  const { data: users, isPending } = useQuery<TempUserType[]>({
    queryKey: ['users', debouncedSearch, active, role],
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      if (active !== 'all') {
        params.set('active', active);
      }
      if (role !== 'all') {
        params.set('role', role);
      }
      return fetch(`/api/user?${params.toString()}`).then(res => res.json());
    },

  });

  return (
    <div className="flex flex-col gap-6 px-8">
      <div className="flex items-center justify-between gap-3 pl-4">
        <div className="flex items-center gap-3">
          <Filter size={24} color="#8c8c8c" />
          <div className="flex items-center gap-2">
            <Select value={active} onValueChange={setActive}>
              <SelectTrigger className="min-w-28">
                {mapStatus[active]}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="min-w-28">
                {mapRole[role]}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="educator">Educator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>
      {isPending && (
        <div className="absolute left-1/2 top-60 -translate-x-1/2 -translate-y-1/2">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}
      {
        !isPending && users && users.length > 0
          ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.name}
                        {' '}
                        {user.lastName || ''}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.active ? 'success' : 'error'}>
                          {user.active ? <Check size={12} /> : <X size={12} />}
                          {user.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <EditUserDialog user={user}>
                          <Button variant="ghost" size="icon" className="[&_svg]:size-6">
                            <Edit />
                          </Button>
                        </EditUserDialog>
                        <Button variant="ghost" size="icon" className="[&_svg]:size-6">
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          : (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center justify-center">
                  <UserImageEmptyState />
                  <h2 className="text-2xl font-bold">It looks empty in here.</h2>
                  <h3>Add users.</h3>
                </div>
              </div>
            )
      }
    </div>
  );
}
