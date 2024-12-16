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
import { Switch } from '@/components/ui/switch';
import { CreateOrganizationSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';

type CreateOrganizationFormType = z.infer<typeof CreateOrganizationSchema>;
type AddOrganizationFormProps = {
  defaultValues?: CreateOrganizationFormType;
  onSubmit: (data: CreateOrganizationFormType) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const initialValues: CreateOrganizationFormType = {
  name: '',
  active: true,
};

export default function OrganizationForm({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: AddOrganizationFormProps) {
  const form = useForm<CreateOrganizationFormType>({
    resolver: zodResolver(CreateOrganizationSchema),
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
          name="name"
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
        <div>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel>Activate Organization?</FormLabel>
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
          {onDelete && (
            <Button
              type="button"
              onClick={onDelete}
              variant="destructive"
            >
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
