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
import { Input } from '@/components/ui/input';
import type { TSchool } from '@acme/database/schema';
import { CreateShipmentSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type AddShipmentFormProps = {
  defaultValues?: z.infer<typeof CreateShipmentSchema>;
  onSubmit: (data: z.infer<typeof CreateShipmentSchema>) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const initialValues: z.infer<typeof CreateShipmentSchema> = {
  schoolId: '',
  address: '',
  contact: '',
  status: 'pending',
  phone: '',
};

export default function AddShipmentForm({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: AddShipmentFormProps) {
  const form = useForm<z.infer<typeof CreateShipmentSchema>>({
    resolver: zodResolver(CreateShipmentSchema),
    defaultValues,
  });

  const { data: schools, isPending } = useQuery<TSchool[]>({
    queryKey: ['schools-combobox'],
    queryFn: async () => {
      const response = await fetch(`/api/school`);
      return response.json();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-3"
      >
        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>School</FormLabel>

              <FormControl>
                <Combobox
                  value={field.value!}
                  list={
                    (!isPending && schools && schools.length > 0)
                      ? schools.map((schools) => {
                        return {
                          value: schools.id,
                          label: schools.name,
                        };
                      })
                      : []
                  }
                  onChange={field.onChange}
                  placeholder="Select School..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Address</FormLabel>

              <FormControl>
                <Input placeholder="Shipment Address" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-center gap-6">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contact Name</FormLabel>

                <FormControl>
                  <Input placeholder="Contact Name" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone Number</FormLabel>

                <FormControl>
                  <Input placeholder="Phone Number" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-between gap-6">
          {!!onDelete && (
            <Button variant="destructive" onClick={onDelete} type="button">
              <Trash />
              {' '}
              Delete
            </Button>
          )}
          <div className="flex w-full justify-end gap-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              Next
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
