'use client';

import { UploadButton } from '@/utils/uploadthing';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // eslint-disable-next-line no-console
          console.log('Files: ', res);
        }}
      />
    </main>
  );
}
