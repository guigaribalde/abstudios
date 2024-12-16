import { db } from '@acme/database/client';
import MuxVideoPlayer from '@mux/mux-player-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const video = await db.query.Video.findFirst({
    where: (video, { eq }) => eq(video.playbackId, params.id),
  });
  if (!video) {
    return null;
  }
  return (
    <>
      {/* <div className="flex size-full overflow-hidden px-12 py-8"> */}
      {/*   <div className="flex size-full flex-col"> */}
      {/*     <div className="mx-auto flex h-full flex-col gap-4"> */}
      {/*       <MuxVideoPlayer */}
      {/*         className="aspect-video h-full min-h-0 w-fit flex-1 overflow-hidden rounded-md" */}
      {/*         playbackId={params.id} */}
      {/*         accentColor="#1B70B5" */}
      {/*       /> */}
      {/*       <div className="flex flex-col gap-2"> */}
      {/*         <h1 className="text-3xl font-bold"> */}
      {/*           {video.title} */}
      {/*         </h1> */}
      {/**/}
      {/*         <p className="font-medium text-muted-foreground"> */}
      {/*           {video.subtitle} */}
      {/*         </p> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
      <div className="fixed inset-0 z-40">
        <Link
          href="/app/videos"
          className="absolute left-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <MuxVideoPlayer
          className="size-full"
          playbackId={params.id}
          accentColor="#1B70B5"
          autoPlay
        />
      </div>
    </>
  );
}
