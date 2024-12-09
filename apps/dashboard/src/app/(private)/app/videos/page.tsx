import { Button } from '@/components/ui/button';
import UploadImageEmptyState from '@/lib/assets/empty-states/upload-image';
import { Plus } from 'lucide-react';
import AddVideoDialog from './add-video-dialog';

export default function Page() {
  return (
    <div className="flex grow flex-col">
      <div className="flex w-full items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-bold">Videos</h1>
        <AddVideoDialog>
          <Button>
            <Plus />
            New Video
          </Button>
        </AddVideoDialog>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center">
          <UploadImageEmptyState />
          <h2 className="text-2xl font-bold">It looks empty in here.</h2>
          <h3>Start uploading videos.</h3>
        </div>
      </div>
    </div>
  );
}
