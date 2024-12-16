'use client';

import type { TCourse } from '@acme/database/schema';
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
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

  const queryClient = useQueryClient();
  const isNewCourse = !courses.find(course => course.value === form.watch('courseId'))?.id;

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
                      placeholder="Select season..."
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
                      <Input
                        type="number"
                        disabled={!form.watch('courseId')?.length}
                        placeholder="Insert a season number..."
                        {...field}
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
                      <Input
                        type="number"
                        disabled={!form.watch('courseId')?.length}
                        placeholder="Insert a session number..."
                        {...field}
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
            Save
          </Button>
        </div>

      </form>
    </Form>
  );
});
export default AddCourseForm;
