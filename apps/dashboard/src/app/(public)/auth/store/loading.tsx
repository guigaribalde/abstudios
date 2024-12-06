import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default async function Page() {
  return (
    <div className="flex size-full items-center justify-center overflow-hidden bg-engineering-dark-blue bg-cover bg-center bg-no-repeat">
      <Card className="flex w-full max-w-96 flex-col gap-8 p-9">
        <CardHeader className="flex flex-col gap-8 p-0">
          <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={128} height={64} />
          <div>
            <CardTitle className="text-2xl font-bold">Wait while we setup your account</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              You are almost there...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="m-auto p-0">
          <Loader2 className="animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
