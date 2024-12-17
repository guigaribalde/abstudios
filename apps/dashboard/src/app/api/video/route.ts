import supabase from '@/lib/supabase';
import { db, eq } from '@acme/database/client';
import { Course, Season, Session, Video } from '@acme/database/schema';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function GET(_req: Request) {
  try {
    const videos = await db.select()
      .from(Video)
      .leftJoin(Session, eq(Video.sessionId, Session.id))
      .leftJoin(Season, eq(Session.seasonId, Season.id))
      .leftJoin(Course, eq(Season.courseId, Course.id));

    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching Mux upload:', error);
    return Response.json(
      { error: 'Failed to fetch upload status' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const { videoId, pdfPath } = await req.json();

  if (pdfPath) {
    const { error } = await supabase.storage.from('files').remove([pdfPath]);
    if (error) {
      throw new Error('Failed to delete PDF');
    }
  }

  if (videoId) {
    const upload = await mux.video.uploads.retrieve(videoId);
    if (upload.asset_id) {
      await mux.video.assets.delete(upload.asset_id);
    }
  }

  return new Response(null, { status: 204 });
}
