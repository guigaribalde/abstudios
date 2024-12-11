'use client';

import type { z } from 'zod';
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
import { Switch } from '@/components/ui/Switch';
import { CreateSchoolSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

type CreateSchoolFormType = z.infer<typeof CreateSchoolSchema>;
type AddSchoolFormProps = {
  defaultValues?: CreateSchoolFormType;
  onSubmit: (data: CreateSchoolFormType) => void;
  onCancel: () => void;
};

const initialValues: CreateSchoolFormType = {
  organizationName: '',
  name: '',
  active: true,
};

export default function SchoolForm({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
}: AddSchoolFormProps) {
  const form = useForm<CreateSchoolFormType>({
    resolver: zodResolver(CreateSchoolSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-6"
      >

        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Organization Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="School Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel>Activate School?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full justify-end gap-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
