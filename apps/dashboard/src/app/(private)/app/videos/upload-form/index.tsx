'use client';

import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BookText, Video } from 'lucide-react';
import { useRef, useState } from 'react';
import { z } from 'zod';
import AddCourseForm, { type AddCourseFormRef, AddCourseFormSchema, type AddCourseFormType } from './add-course-form';
import AddVideoForm, { type AddVideoFormRef, type AddVideoFormType, AddVideoSchema } from './add-video-form';

export const UploadFormSchema = z.object({
  video: AddVideoSchema,
  course: AddCourseFormSchema,
});

export type UploadFormType = z.infer<typeof UploadFormSchema>;

type UploadFormProps = {
  defaultValues?: UploadFormType;
  onSubmit: (data: UploadFormType) => void;
  onCancel: () => void;
};

export default function UploadForm({
  defaultValues,
  onSubmit,
  onCancel,
}: UploadFormProps) {
  const [videoForm, setVideoForm] = useState(defaultValues?.video || undefined as unknown as AddVideoFormType);
  const [courseForm, setCourseForm] = useState(defaultValues?.course || undefined as unknown as AddCourseFormType);
  const [tab, setTab] = useState<'video' | 'course' >('video');

  const videoFormRef = useRef<AddVideoFormRef>(null);
  const courseFormRef = useRef<AddCourseFormRef>(null);
  async function saveCurrentTab() {
    if (tab === 'video') {
      const isVideoFormValid = await videoFormRef.current?.valid();
      if (!isVideoFormValid) {
        videoFormRef.current?.submit();
        return false;
      }
      const values = videoFormRef.current?.values();
      setVideoForm(values!);
    }

    if (tab === 'course') {
      const isCourseFormValid = await courseFormRef.current?.valid();
      if (!isCourseFormValid) {
        courseFormRef.current?.submit();
        return false;
      }
      const values = courseFormRef.current?.values();
      setCourseForm(values!);
    }

    return true;
  }

  return (
    <div className="flex size-full flex-col items-start gap-4">
      <Tabs value={tab} defaultValue="video" className="flex size-full flex-col">
        <TabsList className="m-0 h-fit w-full bg-transparent p-0 text-neutral-900">
          <button
            className={
              cn(
                'flex w-full items-center gap-2 border-b-2 border-solid p-3 rounded-t-md disabled:opacity-50 disabled:cursor-not-allowed',
                tab === 'video' ? 'bg-primary-0 border-primary' : 'border-neutral-200',
              )
            }
            type="button"
            onClick={async () => {
              const saved = await saveCurrentTab();
              if (!saved) {
                return;
              }
              setTab('video');
            }}
          >
            <Video className="size-4" />
            <span>
              Video Upload
            </span>
          </button>
          <button
            disabled={!videoForm?.uploadId}
            className={
              cn(
                'flex w-full items-center gap-2 border-b-2 border-solid p-3 rounded-t-md disabled:opacity-50 disabled:cursor-not-allowed',
                tab === 'course' ? 'bg-primary-0 border-primary' : 'border-neutral-200',
              )
            }
            type="button"
            onClick={async () => {
              const saved = await saveCurrentTab();
              if (!saved) {
                return;
              }
              setTab('course');
            }}
          >
            <BookText className="size-4" />
            <span>
              Course Details
            </span>
          </button>
        </TabsList>
        <TabsContent value="video" className="grow">
          <AddVideoForm
            ref={videoFormRef}
            defaultValues={videoForm}
            onCancel={onCancel}
            onSubmit={(data) => {
              setVideoForm(data);
              setTab('course');
            }}
          />
        </TabsContent>
        <TabsContent value="course" className="grow">
          <AddCourseForm
            ref={courseFormRef}
            defaultValues={courseForm}
            onCancel={onCancel}
            onSubmit={(data) => {
              setCourseForm(data);
              onSubmit({
                course: courseForm,
                video: videoForm,
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
