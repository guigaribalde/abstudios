'use client';

import type { TCourse, TSeason, TSession } from '@acme/database/schema';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TagsInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, TrashIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PDF_PATH_KEY } from '../add-video-dialog';
import { deleteFile, uploadFile } from './course-actions';

export const AddCourseFormSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  category: z.enum([
    'STEM',
    'World Languages & Cultures',
    'Fitness & Wellness',
    'Arts & Entertainment',
    'Maker',
    'Personal Skill Building',
  ]),
  seasonNumber: z.string().min(1, 'Season is required'),
  sessionNumber: z.string().min(1, 'Session is required'),
  description: z.string().min(1, 'A description is required'),
  tags: z.array(z.string()).nonempty('Add at least one tag.'),
  file: z.object({
    name: z.string(),
    url: z.string(),
  }).optional(),
});

type Item = {
  value: string;
  label: string;
};

export type AddCourseFormType = z.infer<typeof AddCourseFormSchema>;
type AddCourseFormProps = {
  defaultValues?: AddCourseFormType;
  onSubmit: (data: AddCourseFormType) => void;
  onCancel: () => void;
};

const initialValues: AddCourseFormType = {
  courseId: '',
  category: '' as 'STEM',
  seasonNumber: '',
  sessionNumber: '',
  description: '',
  tags: [] as unknown as [string],
};

export type AddCourseFormRef = {
  values: () => AddCourseFormType;
  valid: () => Promise<boolean>;
  submit: () => void;
};

const AddCourseForm = forwardRef<AddCourseFormRef, AddCourseFormProps>(({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
}, ref) => {
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [deletingFile, setDeletingFile] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AddCourseFormType>({
    mode: 'onChange',
    resolver: zodResolver(AddCourseFormSchema),
    defaultValues,
  });

  const categories: {
    value: TCourse['category'];
    label: TCourse['category'];
  }[] = [
    { label: 'STEM', value: 'STEM' },
    { label: 'Maker', value: 'Maker' },
    { label: 'Fitness & Wellness', value: 'Fitness & Wellness' },
    { label: 'Arts & Entertainment', value: 'Arts & Entertainment' },
    { label: 'Personal Skill Building', value: 'Personal Skill Building' },
    { label: 'World Languages & Cultures', value: 'World Languages & Cultures' },
  ];

  const { data: courses = [] } = useQuery<(TCourse & Item)[]>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/course');
      const data = await response.json();
      const courses = data.map((course: TCourse) => ({
        ...course,
        label: course.title,
        value: course.id,
      })) as (TCourse & Item)[];

      if (defaultValues?.courseId && !courses.find(course => course.id === defaultValues.courseId)) {
        courses.push({
          ...defaultValues,
          label: defaultValues.courseId,
          value: defaultValues.courseId,
        } as unknown as (TCourse & Item));
      }
      return courses;
    },
  });

  const isNewCourse = !courses.find(course => course.value === form.watch('courseId'))?.id;
  const courseId = form.watch('courseId');

  const { data: seasons = [], isLoading: isLoadingSeasons } = useQuery<(TSeason & Item)[]>({
    queryKey: ['seasons', courseId],
    queryFn: async () => {
      const response = await fetch(`/api/season?courseId=${courseId}`);
      const data = await response.json();
      return data.map((season: TSeason) => ({
        ...season,
        label: season.number,
        value: `${season.number}`,
      })) as (TSeason & Item)[];
    },
    enabled: !!courseId && !isNewCourse,
  });

  const seasonNumber = form.watch('seasonNumber');

  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery<(TSession & Item)[]>({
    queryKey: ['sessions', courseId, seasonNumber],
    queryFn: async () => {
      const response = await fetch(`/api/session?courseId=${courseId}&seasonNumber=${seasonNumber}`);
      const data = await response.json();
      return data.map((session: TSession) => ({
        ...session,
        label: session.number,
        value: `${session.number}`,
        disabled: true,
      })) as (TSession & Item)[];
    },
    enabled: !isNewCourse && (!!courseId && !!seasonNumber),
  });

  const queryClient = useQueryClient();

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

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      form.setError('file', { message: 'File must be a PDF' });
      return;
    }

    setUploadingFile(true);

    if (form.getValues('file')?.url) {
      await deleteFile(form.getValues('file')!.url!);
    }

    const { data, error } = await uploadFile(file);

    setUploadingFile(false);

    if (error || !data) {
      form.setError('file', { message: error?.message || 'Failed to upload file' });
      return;
    }

    localStorage.setItem(PDF_PATH_KEY, data.path);

    form.clearErrors('file');

    form.setValue('file', {
      name: file.name,
      url: data.path,
    });
  };

  const handleDeleteFile = async () => {
    setDeletingFile(true);
    if (form.getValues('file')?.url) {
      await deleteFile(form.getValues('file')!.url!);
      localStorage.removeItem(PDF_PATH_KEY);
    }
    form.setValue('file', undefined);
    setDeletingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.files = null;
      fileInputRef.current.value = '';
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex size-full flex-col justify-between"
      >

        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Course</FormLabel>

                <FormControl>
                  <Combobox
                    value={field.value}
                    list={courses}
                    onChange={(id) => {
                      field.onChange(id);
                      const currentCourse = courses.find(course => course.value === id);
                      if (!currentCourse) {
                        return;
                      }
                      form.setValue('category', currentCourse.category);
                      form.setValue('description', currentCourse.description);
                      form.setValue('tags', currentCourse.tags as [string]);
                    }}
                    onCreate={(value) => {
                      queryClient.setQueryData(['courses'], (old: (TCourse & Item)[] | undefined) => {
                        const newCourse = {
                          id: '',
                          title: '',
                          category: '',
                          description: '',
                          label: value,
                          value,
                        };
                        return [...(old || []), newCourse];
                      });
                      field.onChange(value);
                      form.setValue('category', '' as 'STEM');
                      form.setValue('description', '');
                      form.setValue('seasonNumber', '');
                      form.setValue('sessionNumber', '');
                      form.setValue('tags', [] as unknown as [string]);
                    }}
                    placeholder="Select course..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled={!isNewCourse}
                      placeholder="Select category..."
                      value={field.value}
                      list={categories}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="seasonNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Season</FormLabel>

                    <FormControl>
                      <Combobox
                        value={field.value}
                        list={seasons}
                        onChange={(seasonNumber) => {
                          field.onChange(seasonNumber);
                          form.setValue('sessionNumber', '');
                        }}
                        onCreate={(value) => {
                          if (!(/^\d+$/.test(value))) {
                            form.setError('seasonNumber', { message: 'Season number must be a number' });
                            return;
                          }
                          queryClient.setQueryData(['seasons', courseId], (old: (TCourse & Item)[] | undefined) => {
                            const newSeason = {
                              id: '',
                              number: value,
                              label: value,
                              value,
                            };
                            return [...(old || []), newSeason];
                          });
                          form.setValue('sessionNumber', '');
                          field.onChange(value);
                        }}
                        loading={isLoadingSeasons}
                        placeholder=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Session</FormLabel>

                    <FormControl>
                      <Combobox
                        value={field.value}
                        list={sessions}
                        disabled={!seasonNumber.length}
                        onChange={(sessionNumber) => {
                          field.onChange(sessionNumber);
                        }}
                        onCreate={(value) => {
                          const existingSession = sessions.find(session => session.value === value);
                          if (existingSession) {
                            return;
                          }

                          if (!(/^\d+$/.test(value))) {
                            form.setError('sessionNumber', { message: 'Session number must be a number' });
                            return;
                          }

                          queryClient.setQueryData(['sessions', courseId, seasonNumber], (old: (TCourse & Item)[] | undefined) => {
                            const newSession = {
                              id: '',
                              number: value,
                              label: value,
                              value,
                            };
                            return [...(old || []), newSession];
                          });
                          field.onChange(value);
                        }}
                        loading={isLoadingSessions}
                        placeholder=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tags</FormLabel>

                <FormControl>
                  <TagsInput
                    disabled={!isNewCourse}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Tags..."
                  />
                </FormControl>
                <FormDescription>Press 'Enter' to add a new tag</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      disabled={!isNewCourse}
                      placeholder="Describe the course"
                      className="resize-none"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </div>
        <div className="mt-3 flex w-full">
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem className="flex-1">
                <FormLabel>PDF</FormLabel>
                <FormControl>
                  <div className="relative flex items-center gap-2.5">
                    <Input
                      disabled={!isNewCourse || !form.getValues('courseId')}
                      type="file"
                      onChange={handleChangeFile}
                      accept="application/pdf"
                      ref={fileInputRef}
                    />
                    {uploadingFile && <Loader2 className="absolute right-14 size-4 animate-spin" />}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive/80 [&_svg]:size-6"
                      disabled={!isNewCourse || !form.getValues('file')?.url || deletingFile}
                      onClick={handleDeleteFile}
                    >
                      {deletingFile ? <Loader2 className="animate-spin text-foreground" /> : <TrashIcon />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-auto flex w-full flex-1 justify-end gap-3">
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
              Save
            </Button>
          </div>
        </div>

      </form>
    </Form>
  );
});
export default AddCourseForm;
