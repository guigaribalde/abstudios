import MuxVideoPlayer from '@mux/mux-player-react';

export default function VideoPage({ params }: { params: { id: string } }) {
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
