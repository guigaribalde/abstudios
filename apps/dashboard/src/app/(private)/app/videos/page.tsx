'use client';

import type { TCourse, TSeason, TSession, TVideo } from '@acme/database/schema';
import { Button } from '@/components/ui/button';
import UploadImageEmptyState from '@/lib/assets/empty-states/upload-image';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import AddVideoDialog from './add-video-dialog';
import Grid, { type Item } from '@/components/video-grid/grid';
import { useRouter } from 'next/navigation';

type Video = {
  video: TVideo
  session: TSession,
  season: TSeason,
  course: TCourse
}

export default function Page() {
  const router = useRouter();
  const { data: videos = [] } = useQuery<Item[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await fetch('/api/video');
      const data: Video[] = await response.json();
      const videos: Item[] = data.map(item => ({
        playbackId: String(item.video.playbackId),
        subtitle: item.video.subtitle,
        session: item.session.number,
        season: item.season.number,
        courseDescription: item.course.description,
        title: item.video.title,
        thumbnail: `https://image.mux.com/${String(item.video.playbackId)}/thumbnail.png`,
        tags: item.course.tags,
        category: item.course.category,
        createdAt: item.video.createdAt
      }))
      return videos
    },
  });
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

      <div className="px-12">
        {videos.length === 0
          ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center justify-center">
                <UploadImageEmptyState />
                <h2 className="text-2xl font-bold">It looks empty in here.</h2>
                <h3>Start uploading videos.</h3>
              </div>
            </div>
          )
          : (
            <Grid itens={videos} onPlay={(id)=>{
              router.push(`/app/videos/${id}`)
            }} />
          )}
      </div>
    </div>
  );
}
