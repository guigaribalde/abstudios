'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import ShipmentsEmptyState from '@/lib/assets/empty-states/shipments';
import type { ShipmentWithSchool } from '@acme/database/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Edit, Filter, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import EditShipmentDialog from './edit-shipment-dialog';
import ShipmentStatusBadge from './shipment-status-badge';

const mapStatus: Record<string, string> = {
  pending: 'Pending',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  all: 'All Status',
};

export default function ShipmentsPage() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<string>('all');

  const debouncedSearch = useDebounce(search, 500);

  const { data: shipments, isPending } = useQuery<ShipmentWithSchool[]>({
    queryKey: ['shipment', debouncedSearch, active],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      if (active !== 'all') {
        params.set('active', active);
      }
      const shipments = await fetch(`/api/shipment?${params.toString()}`);
      return shipments.json();
    },

  });

  const queryClient = useQueryClient();

  async function deleteUser(id: string) {
    const response = await fetch(`/api/shipment/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete shipment');
    }

    return response.json();
  }

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipment'] });
      toast.success('User deleted!');
    },
    onError: () => {
      toast.error('Failed to delete shipment :(');
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
      {
        (!isPending && shipments && shipments.length > 0)
          ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments?.map(shipment => (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        {shipment.school.name}
                      </TableCell>
                      <TableCell>{shipment.address}</TableCell>
                      <TableCell>{shipment.phone}</TableCell>
                      <TableCell>
                        <ShipmentStatusBadge status={shipment.status} />
                      </TableCell>
                      <TableCell>{shipment.contact}</TableCell>
                      <TableCell className="flex gap-2">
                        <EditShipmentDialog shipment={shipment}>
                          <Button variant="ghost" size="icon" className="[&_svg]:size-6">
                            <Edit />
                          </Button>
                        </EditShipmentDialog>
                        <Button variant="ghost" size="icon" className="[&_svg]:size-6" onClick={() => deleteMutation.mutate(shipment.id)}>
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
                  <ShipmentsEmptyState />
                  <h2 className="text-2xl font-bold">It looks empty in here.</h2>
                  <h3>No shipments have been scheduled yet.</h3>
                </div>
              </div>
            )
      }
    </div>
  );
}
