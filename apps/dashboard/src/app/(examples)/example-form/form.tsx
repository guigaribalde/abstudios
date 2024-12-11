'use client';

import type { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { CreateExampleSchema } from '@acme/database/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type AddExampleFormProps = {
  defaultValues?: z.infer<typeof CreateExampleSchema>;
  onSubmit: (data: z.infer<typeof CreateExampleSchema>) => void;
};

const initialValues: z.infer<typeof CreateExampleSchema> = {
  example: '',
};

export default function AddExampleForm({
  defaultValues = initialValues,
  onSubmit,
}: AddExampleFormProps) {
  const form = useForm<z.infer<typeof CreateExampleSchema>>({
    resolver: zodResolver(CreateExampleSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-3"
      >
        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Example</FormLabel>

              <FormControl>
                <Input placeholder="Example name" type="text" {...field} />
              </FormControl>
              <FormDescription>The example</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="button"
          onClick={form.handleSubmit(onSubmit)}
        >
          Add example
        </Button>
      </form>
    </Form>
  );
}
