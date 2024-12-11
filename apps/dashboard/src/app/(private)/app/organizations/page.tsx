import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddOrganizationDialog from './add-organization-dialog';
import { OrganizationsPage } from './organizations-page';

export default async function Page() {
  return (
    <div className="flex grow flex-col">
      <div className="flex w-full items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-bold">Organization Management</h1>
        <AddOrganizationDialog>
          <Button>
            <Plus />
            New Organization
          </Button>
        </AddOrganizationDialog>
      </div>
      <OrganizationsPage />
    </div>
  );
}
