import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddSchoolDialog from './add-school-dialog';
import { SchoolsPage } from './schools-page';

export default async function Page() {
  return (
    <div className="flex grow flex-col">
      <div className="flex w-full items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-bold">School Management</h1>
        <AddSchoolDialog>
          <Button>
            <Plus />
            New School
          </Button>
        </AddSchoolDialog>
      </div>
      <SchoolsPage />
    </div>
  );
}
