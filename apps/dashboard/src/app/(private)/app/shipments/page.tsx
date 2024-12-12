'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddShipmentDialog from './add-shipment-dialog';
import ShipmentsPage from './shipments-page';

export default function Page() {
  return (
    <div className="flex size-full flex-col">
      <div className="flex w-full items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-bold">Shipments</h1>
        <AddShipmentDialog>
          <Button>
            <Plus />
            New Shipment
          </Button>
        </AddShipmentDialog>
      </div>
      <ShipmentsPage />
    </div>
  );
}
