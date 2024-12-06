'use client';

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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>;
type ForgotPasswordFormProps = {
  defaultValues?: ForgotPasswordFormType;
  onSubmit: (data: ForgotPasswordFormType) => void;
};

const initialValues: ForgotPasswordFormType = {
  email: '',
};

export default function ForgotPasswordForm({
  defaultValues = initialValues,
  onSubmit,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input placeholder="abc@gmail.com" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-3 w-full"
          type="button"
          onClick={form.handleSubmit(onSubmit)}
        >
          Send reset link
        </Button>
      </form>
    </Form>
  );
}
