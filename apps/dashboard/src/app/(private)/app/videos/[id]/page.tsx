import MuxVideoPlayer from '@mux/mux-player-react';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <div className="size-full px-12 py-8">
      <div className="aspect-video w-full">
        <MuxVideoPlayer
          playbackId={params.id}
          accentColor="#1B70B5"
        />
      </div>
    </div>
  );
}
