'use client';

import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateVideoSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import MuxPlayer from '@mux/mux-player-react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';

type AddVideoFormType = z.infer<typeof CreateVideoSchema>;
type AddVideoFormProps = {
  defaultValues?: AddVideoFormType;
  onSubmit: (data: AddVideoFormType) => void;
};

const initialValues: AddVideoFormType = {
  url: '',
  title: '',
  description: '',
  sessionId: v4(),
};

export default function AddVideoForm({
  defaultValues = initialValues,
  onSubmit,
}: AddVideoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AddVideoFormType>({
    resolver: zodResolver(CreateVideoSchema),
    defaultValues,
  });
  const [uploadId, setUploadId] = useState('');
  const [assetId, setAssetId] = useState('');

  const { data: uploadStatus } = useQuery({
    queryKey: ['upload', uploadId],
    queryFn: async () => {
      if (!uploadId) {
        return null;
      }
      const response = await fetch(`/api/video/upload?id=${uploadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch upload status');
      }
      const res = await response.json();
      console.log(res);
      if (res.asset_id) {
        setAssetId(res.asset_id);
        setIsLoading(false);
      }
      return res;
    },
    enabled: !!uploadId && !assetId.length,
    refetchInterval: 1000, // Poll every 1 second
    refetchIntervalInBackground: false,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8"
      >
        <div className="flex w-full gap-8">
          <div className="flex w-full flex-col gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input placeholder="Your title" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Subtitle</FormLabel>

                  <FormControl>
                    <Input placeholder="Your subtitle" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          {isLoading
            ? (
                <div className="flex h-52 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 ">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              )
            : assetId
              ? (

                  <MuxPlayer
                    streamType="on-demand"
                    playbackId={assetId}
                    metadataVideoTitle="Placeholder (optional)"
                    metadataViewerUserId="Placeholder (optional)"
                    primaryColor="#FFFFFF"
                    secondaryColor="#000000"
                    accentColor="#1B70B5"
                  />
                )
              : (
                  <FileUploader
                    className="w-full"
                    maxSize={1024 * 1024 * 512}
                    onValueChange={async (data) => {
                      setIsLoading(true);
                      const formData = new FormData();
                      formData.append('file', data[0]);

                      try {
                        const response = await fetch('/api/video/upload', {
                          method: 'POST',
                          body: formData,
                        });

                        if (!response.ok) {
                          throw new Error('Failed to upload video');
                        }

                        const result = await response.json();
                        setUploadId(result.id);
                        console.log('Video uploaded:', result);
                      } catch (error) {
                        console.error('Error uploading video:', error);
                      }
                    }}
                  />
                )}
        </div>

        <div className="flex w-full justify-end gap-3">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
