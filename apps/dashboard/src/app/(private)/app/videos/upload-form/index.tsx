'use client';

import {
  Form,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookText, CalendarDays, Video } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddCourseForm, { type AddCourseFormRef, type AddCourseFormType } from './add-course-form';
import AddVideoForm, { type AddVideoFormRef, type AddVideoFormType } from './add-video-form';
import ExtraForm from './extra-form';

const UploadFormSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  email: z.string().email(),
});

type UploadFormType = z.infer<typeof UploadFormSchema>;
type UploadFormProps = {
  defaultValues?: UploadFormType;
  onSubmit: (data: UploadFormType) => void;
};

const initialValues: UploadFormType = {
  title: '',
  subtitle: '',
  email: '',
};

export default function UploadForm({
  defaultValues = initialValues,
  onSubmit,
}: UploadFormProps) {
  const [videoForm, setVideoForm] = useState({} as AddVideoFormType);
  const [courseForm, setCourseForm] = useState({} as AddCourseFormType);
  const [tab, setTab] = useState<'video' | 'course' | 'extra'>('extra');
  const form = useForm<UploadFormType>({
    resolver: zodResolver(UploadFormSchema),
    defaultValues,
  });

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex size-full flex-col items-start gap-4"
      >
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
              // disabled={!videoForm.uploadId}
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
            <button
              disabled
              className={
                cn(
                  'flex w-full items-center gap-2 border-b-2 border-solid p-3 rounded-t-m disabled:opacity-50 disabled:cursor-not-allowed',
                  tab === 'extra' ? 'bg-primary-0 border-primary' : 'border-neutral-200',
                )
              }
              type="button"
              onClick={async () => {
                const saved = await saveCurrentTab();
                if (!saved) {
                  return;
                }
                setTab('extra');
              }}
            >
              <CalendarDays className="size-4" />
              <span>
                Additional Details
              </span>
            </button>
          </TabsList>
          <TabsContent value="video" className="grow">
            <AddVideoForm
              ref={videoFormRef}
              defaultValues={videoForm}
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
              onSubmit={(data) => {
                setCourseForm(data);
                setTab('extra');
              }}
            />
          </TabsContent>
          <TabsContent value="extra" className="grow">
            <ExtraForm
              onSubmit={()=>{}}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
