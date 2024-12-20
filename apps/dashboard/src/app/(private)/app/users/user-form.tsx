'use client';

import type { TSchool } from '@acme/database/schema';
import type { UserType } from './type';
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
import { CreateUserSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';

type AddUserFormProps = {
  defaultValues?: UserType;
  onSubmit: (data: UserType) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const initialValues: UserType = {
  name: '',
  lastName: '',
  email: '',
  role: 'educator',
  phone: '',
  schoolId: '',
  active: true,
};

export default function UserForm({
  defaultValues = initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: AddUserFormProps) {
  const form = useForm<UserType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues,
  });

  const { data: schools } = useQuery<TSchool[]>({
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
        className="flex w-full flex-col items-start gap-4"
      >
        <div className="flex w-full items-center gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input placeholder="Placeholder Text" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>

                <FormControl>
                  <Input placeholder="Placeholder Text" type="text" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full items-center gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>E-mail Address</FormLabel>

                <FormControl>
                  <Input placeholder="Placeholder Text" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>

                <FormControl>
                  <Combobox
                    value={field.value}
                    list={
                      [
                        { value: 'educator', label: 'Educator' },
                        { value: 'admin', label: 'Admin' },
                        { value: 'super-admin', label: 'Super Admin' },
                      ]
                    }
                    onChange={field.onChange}
                    placeholder="Select course..."
                    // value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full items-center gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Placeholder Text"
                    type="text"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      schools?.map((schools) => {
                        return {
                          value: schools.id,
                          label: schools.name,
                        };
                      })
                      ?? []
                    }
                    onChange={field.onChange}
                    placeholder="Select School..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full items-center gap-6">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Activate User?</FormLabel>

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
