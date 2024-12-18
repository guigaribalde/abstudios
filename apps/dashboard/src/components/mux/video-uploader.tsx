'use client';
import type Mux from '@mux/mux-node';
import { VIDEO_ID_KEY } from '@/app/(private)/app/videos/add-video-dialog';
import { cn } from '@/lib/utils';
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect } from '@mux/mux-uploader-react';
import { AlertCircle, CheckCircle, Upload, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

type VideoUploaderProps = {
  onComplete?: (upload: Mux.Video.Uploads.Upload) => void;
  forceComplete?: boolean;
  error?: string;
};

type ErrorStateProps = {
  error?: string;
};

function ErrorState(props: ErrorStateProps) {
  return (
    <>
      <span slot="heading" className="text-xl"><AlertCircle className="size-12 text-red-500" /></span>
      <span slot="separator" className="hidden"></span>

      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-red-500">
            drop a file here
          </p>
          <p className="flex items-center gap-2 text-xs text-red-600">
            {props.error}
          </p>
        </div>

        <MuxUploaderFileSelect muxUploader="my-uploader">
          <Button
            type="button"
            variant="destructive"
          >
            Select file
          </Button>
        </MuxUploaderFileSelect>
      </div>
    </>
  );
};

export default function VideoUploader(props: VideoUploaderProps) {
  const [upload, setUpload] = useState<Mux.Video.Uploads.Upload>({} as Mux.Video.Uploads.Upload);
  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false); // this is necessary for calling onSuccess

  if ((progress === 100 && isComplete) || props.forceComplete) {
    return (
      <div className="flex aspect-video w-full">
        <div
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-green-500 bg-green-50"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-green-600"><CheckCircle /></span>
            <span className="text-xl font-bold text-green-600">Success!</span>
          </div>
          <span className="text-xs text-neutral-600">Your video is now beeing processed</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex aspect-video w-full">
      <MuxUploader
        id="my-uploader"
        className="hidden"
        onProgress={(e) => {
          const event = e as { detail: number };
          setProgress(event.detail);
        }}
        onSuccess={() => {
          props.onComplete?.(upload);
          setIsComplete(true);
        }}
        onUploadStart={() => {
          setProgress(1);
        }}
        endpoint={async () => {
          const res = await fetch('/api/video/upload/url');
          const json = await res.json() as Mux.Video.Uploads.Upload;
          localStorage.setItem(VIDEO_ID_KEY, json.id);
          setUpload(json);
          return json.url;
        }}
      />

      <MuxUploaderDrop
        id="my-uploader"
        className={cn(
          'flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300',
          props.error && !progress ? 'bg-red-100 border-red-400' : '',
        )}
        overlay
        overlayText="Let it go"
      >

        {props.error && progress === 0
          ? (
              <ErrorState error={props.error} />
            )
          : progress
            ? (
                <>

                  <span slot="heading" className="text-xl">Uploading...</span>
                  <span slot="separator" className="hidden"></span>
                  <Progress value={progress} />
                </>
              )
            : (
                <>
                  <span slot="heading" className="text-xl"><UploadCloud className="size-12 text-neutral-500" /></span>
                  <span slot="separator" className="hidden"></span>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-semibold text-neutral-600">
                        drop a file here
                      </p>
                      <p className="text-xs text-neutral-600">
                        any video up to 1GB
                      </p>
                    </div>

                    <MuxUploaderFileSelect muxUploader="my-uploader">
                      <Button
                        type="button"
                      >
                        Select file
                      </Button>
                    </MuxUploaderFileSelect>
                  </div>
                </>
              )}
      </MuxUploaderDrop>
    </div>
  );
}
