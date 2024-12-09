import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    // const { url } = await req.json();
    //
    // if (!url) {
    //   return Response.json({ error: 'URL is required' }, { status: 400 });
    // }
    //
    // const asset = await mux.video.assets.create({
    //   input: [{ url }],
    //   playback_policy: ['public'],
    //   video_quality: 'basic',
    // });
    //
    // return new Response(JSON.stringify(asset), {
    //   status: 201,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'File is required' }, { status: 400 });
    }

    // Get the file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a direct upload URL
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        video_quality: 'basic',
      },
      cors_origin: '*',
    });

    // Upload the file to the direct upload URL
    await fetch(upload.url, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': file.type,
      },
    });

    // // Get the asset details
    // const asset = await mux.video.assets.retrieveInputInfo('yl1j4c2ILLeYUKVQfyquiA2LgWoskG02u00xhatvkBrOo');

    return new Response(JSON.stringify(upload), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating Mux asset:', error);
    return Response.json(
      { error: 'Failed to create video asset' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Upload ID is required' }, { status: 400 });
    }

    const upload = await mux.video.uploads.retrieve(id);

    if (upload.asset_id) {
      const asset = await mux.video.assets.retrieve(upload.asset_id);
      return Response.json({
        ...upload,
        asset,
      });
    }

    return Response.json(upload);
  } catch (error) {
    console.error('Error fetching Mux upload:', error);
    return Response.json(
      { error: 'Failed to fetch upload status' },
      { status: 500 },
    );
  }
}
