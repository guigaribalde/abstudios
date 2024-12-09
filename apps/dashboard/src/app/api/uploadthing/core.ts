import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  videoUploader: f({
    video: {
      maxFileSize: '512MB',
      maxFileCount: 1,
      minFileCount: 1,
    },
  })
    .middleware(async () => {
      // const user = await auth(req);
      // if (!user) throw new UploadThingError("Unauthorized");
      return { userId: 'batata' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
