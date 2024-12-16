'use client';

import VideoUploader from '@/components/mux/video-uploader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddVideoSchema = z.object({
  url: z.string().url().min(1, 'Upload a file is required'),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  uploadId: z.string().min(1, 'Upload a file is required'),
});

export type AddVideoFormType = z.infer<typeof AddVideoSchema>;
type AddVideoFormProps = {
  defaultValues?: AddVideoFormType;
  onSubmit: (data: AddVideoFormType) => void;
  onCancel: () => void;
};

const initialValues: AddVideoFormType = {
  url: '',
  title: '',
  subtitle: '',
  uploadId: '',
};

export type AddVideoFormRef = {
  values: () => AddVideoFormType;
  valid: () => Promise<boolean>;
  submit: () => void;
};

const AddVideoForm = forwardRef<AddVideoFormRef, AddVideoFormProps>(({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
}, ref) => {
  const form = useForm<AddVideoFormType>({
    mode: 'onChange',
    resolver: zodResolver(AddVideoSchema),
    defaultValues,
  });

  useImperativeHandle(ref, () => ({
    values: () => {
      return form.getValues();
    },
    valid: async () => {
      const { errors } = await form.control._executeSchema(Object.keys(initialValues));
      const valid = Object.keys(errors).length === 0;
      return valid;
      // return form.formState.isValid;
    },
    submit: () => {
      form.handleSubmit(onSubmit)();
    },
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex size-full flex-col justify-between"
      >
        <div className="mt-2 flex w-full gap-8">
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
              name="subtitle"
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
          <VideoUploader
            forceComplete={Boolean(form.watch('url') && form.watch('uploadId'))}
            error={form.formState.errors.uploadId?.message || form.formState.errors.url?.message}
            onComplete={(data) => {
              form.setValue('uploadId', data.id);
              form.setValue('url', data.url);
            }}
          />
        </div>

        <div className="mt-3 flex w-full justify-end gap-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
},
);

export default AddVideoForm;
