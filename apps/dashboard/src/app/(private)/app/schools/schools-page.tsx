'use client';

import type { TSchoolWithOrganization } from '@acme/database/schema';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { SchoolEmptyState } from '@/lib/assets/empty-states/school';
import { useQuery } from '@tanstack/react-query';
import { Check, Edit, Filter, Loader2, Search, X } from 'lucide-react';
import { useState } from 'react';
import EditSchoolDialog from './edit-school-dialog';

const mapStatus: Record<string, string> = {
  true: 'Active',
  false: 'Inactive',
  all: 'All Status',
};

export const SchoolsPage = () => {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<string>('all');

  const debouncedSearch = useDebounce(search, 500);

  const { data: schools, isPending } = useQuery<TSchoolWithOrganization[]>({
    queryKey: ['schools', debouncedSearch, active],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      if (active !== 'all') {
        params.set('active', active);
      }
      const response = await fetch(`/api/school?${params.toString()}`);
      return response.json();
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
      {!isPending && (schools?.length
        ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization Name</TableHead>
                  <TableHead>School Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools?.map(school => (
                  <TableRow key={school.id}>
                    <TableCell className="h-12 py-0">{school.organization?.name ?? school.name}</TableCell>
                    <TableCell className="h-12 py-0">{school.name}</TableCell>
                    <TableCell className="h-12 py-0">
                      <Badge variant={school.active ? 'success' : 'error'}>
                        {school.active ? <Check size={12} /> : <X size={12} />}
                        {school.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-12 py-0">
                      <EditSchoolDialog school={school}>
                        <Button variant="ghost" size="icon" className="[&_svg]:size-6">
                          <Edit />
                        </Button>
                      </EditSchoolDialog>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          )
        : (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center justify-center">
                <SchoolEmptyState />
                <h2 className="text-2xl font-bold">It looks empty in here.</h2>
                <h3>Add schools.</h3>
              </div>
            </div>
          ))}
    </div>
  );
};
