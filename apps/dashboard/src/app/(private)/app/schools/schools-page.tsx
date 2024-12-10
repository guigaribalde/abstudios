'use client';

import type { NewSchool } from '@acme/database/schema';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SchoolEmptyState } from '@/lib/assets/empty-states/school';
import { useQuery } from '@tanstack/react-query';
import { Check, Edit, X } from 'lucide-react';
import EditSchoolDialog from './edit-school-dialog';

export const SchoolsPage = () => {
  const { data: schools, isPending } = useQuery<NewSchool[]>({ queryKey: ['schools'], queryFn: () => fetch('/api/school').then(res => res.json()) });

  if (isPending) {
    return null;
  }

  if (schools && !schools.length) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center">
          <SchoolEmptyState />
          <h2 className="text-2xl font-bold">It looks empty in here.</h2>
          <h3>Add schools.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools?.map(school => (
            <TableRow key={school.id}>
              <TableCell>{school.schoolName || school.organizationName}</TableCell>
              <TableCell>
                <Badge variant={school.active ? 'success' : 'error'}>
                  {school.active ? <Check size={12} /> : <X size={12} />}
                  {school.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
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
    </div>
  );
};
