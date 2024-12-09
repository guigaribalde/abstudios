'use client';

import {
  Form,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookText, CalendarDays, Video } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddCourseForm from './add-course-form';
import AddVideoForm from './add-video-form';

const AddVideoFormSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  email: z.string().email(),
});

type AddVideoFormType = z.infer<typeof AddVideoFormSchema>;
type AddVideoFormProps = {
  defaultValues?: AddVideoFormType;
  onSubmit: (data: AddVideoFormType) => void;
};

const initialValues: AddVideoFormType = {
  title: '',
  subtitle: '',
  email: '',
};

export default function UploadForm({
  defaultValues = initialValues,
  onSubmit,
}: AddVideoFormProps) {
  const [tab, setTab] = useState('video');
  const form = useForm<AddVideoFormType>({
    resolver: zodResolver(AddVideoFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4"
      >
        <Tabs value={tab} defaultValue="video" className="w-full">
          <TabsList className="m-0 h-fit w-full bg-transparent p-0 text-neutral-900">
            <button
              className={
                cn(
                  'flex w-full items-center gap-2 border-b-2 border-solid p-3 rounded-t-md disabled:opacity-50 disabled:cursor-not-allowed',
                  tab === 'video' ? 'bg-primary-0 border-primary' : 'border-neutral-200',
                )
              }
              type="button"
              onClick={() => {
                setTab('video');
              }}
            >
              <Video className="size-4" />
              <span>
                Video Upload
              </span>
            </button>
            <button
              className={
                cn(
                  'flex w-full items-center gap-2 border-b-2 border-solid p-3 rounded-t-md disabled:opacity-50 disabled:cursor-not-allowed',
                  tab === 'course' ? 'bg-primary-0 border-primary' : 'border-neutral-200',
                )
              }
              type="button"
              onClick={() => {
                setTab('course');
              }}
            >
              <BookText className="size-4" />
              <span>
                Course Details
              </span>
            </button>
            <button
              className={
                cn(
                  'flex w-full items-center gap-2 border-b-2 border-solid p-3 rounded-t-m disabled:opacity-50 disabled:cursor-not-allowed',
                  tab === 'extra' ? 'bg-primary-0 border-primary' : 'border-neutral-200',
                )
              }
              type="button"
              onClick={() => {
                setTab('extra');
              }}
            >
              <CalendarDays className="size-4" />
              <span>
                Additional Details
              </span>
            </button>
          </TabsList>
          <TabsContent value="video">
            <AddVideoForm onSubmit={async (data) => {
              const res = await fetch('/api/video', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: data.url }),
              });

              if (!res.ok) {
                throw new Error('Failed to create video');
              }

              const result = await res.json();
              console.log('Video created:', result);
            }}
            />
          </TabsContent>
          <TabsContent value="course" className="flex flex-col gap-8">
            <AddCourseForm onSubmit={() => {}} />
          </TabsContent>
          <TabsContent value="extra">Extra</TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
