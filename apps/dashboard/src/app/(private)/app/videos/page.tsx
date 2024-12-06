import { Button } from '@/components/ui/button';
import UploadImageEmptyState from '@/lib/assets/empty-states/upload-image';
import { Plus } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex grow flex-col">
      <div className="flex w-full items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-bold">Videos</h1>
        <Button>
          <Plus />
          New Video
        </Button>
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
