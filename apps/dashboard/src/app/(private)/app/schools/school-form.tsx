'use client';

import type { TOrganization } from '@acme/database/schema';
import type { z } from 'zod';
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CreateSchoolSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';

type CreateSchoolFormType = z.infer<typeof CreateSchoolSchema>;
type AddSchoolFormProps = {
  defaultValues?: CreateSchoolFormType;
  onSubmit: (data: CreateSchoolFormType) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const initialValues: CreateSchoolFormType = {
  organizationId: '',
  name: '',
  active: true,
};

export default function SchoolForm({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: AddSchoolFormProps) {
  const form = useForm<CreateSchoolFormType>({
    resolver: zodResolver(CreateSchoolSchema),
    defaultValues,
  });

  const { data: organizations, isPending: loadingOrganizations } = useQuery<TOrganization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await fetch('/api/organization');
      return response.json();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-6"
      >

        <FormField
          control={form.control}
          name="organizationId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Combobox
                  placeholder="Select Organization"
                  value={field.value}
                  onChange={field.onChange}
                  list={organizations?.map?.(org => ({
                    label: org.name,
                    value: org.id,
                  })) ?? []}
                  loading={loadingOrganizations}
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
        <div className="flex w-full justify-between gap-3">
          {!!onDelete && (
            <Button onClick={onDelete} type="button" variant="destructive">
              <Trash />
              Delete
            </Button>
          )}
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
        </div>
      </form>
    </Form>
  );
}
