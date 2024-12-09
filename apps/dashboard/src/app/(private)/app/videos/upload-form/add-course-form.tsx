'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

export default function AddCourseForm({
  defaultValues = initialValues,
  onSubmit,
}: AddVideoFormProps) {
  const form = useForm<AddVideoFormType>({
    resolver: zodResolver(AddVideoFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8"
      >

        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Course</FormLabel>

                <FormControl>
                  <Combobox
                    value={field.value}
                    list={[
                      { value: 'a', label: 'a' },
                      { value: 'b', label: 'b' },
                      { value: 'c', label: 'c' },
                      { value: 'd', label: 'd' },
                      { value: 'e', label: 'e' },
                      { value: 'f', label: 'f' },
                      { value: 'g', label: 'g' },
                      { value: 'h', label: 'h' },
                      { value: 'i', label: 'i' },
                      { value: 'j', label: 'j' },
                      { value: 'k', label: 'k' },
                      { value: 'l', label: 'l' },
                      { value: 'm', label: 'm' },
                      { value: 'n', label: 'n' },
                      { value: 'o', label: 'o' },
                      { value: 'p', label: 'p' },
                      { value: 'q', label: 'q' },
                      { value: 'r', label: 'r' },
                      { value: 's', label: 's' },
                      { value: 't', label: 't' },
                      { value: 'u', label: 'u' },
                      { value: 'v', label: 'v' },
                      { value: 'w', label: 'w' },
                    ]}
                    onChange={field.onChange}
                    onCreate={(value) => {
                      console.info(value);
                    }}
                    placeholder="Select course..."
                    // value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled
                      placeholder="Select season..."
                      value={field.value}
                      list={[{ value: 'a', label: 'a' }]}
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
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Season</FormLabel>

                    <FormControl>
                      <Combobox
                        disabled
                        placeholder="Select season..."
                        value={field.value}
                        list={[{ value: 'a', label: 'a' }]}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Session</FormLabel>

                    <FormControl>
                      <Combobox
                        disabled
                        placeholder="Select season..."
                        value={field.value}
                        list={[{ value: 'a', label: 'a' }]}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      disabled
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
          >
            Next
            <ArrowRight />
          </Button>
        </div>

      </form>
    </Form>
  );
}
