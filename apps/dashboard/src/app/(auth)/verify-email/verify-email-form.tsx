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

const VerifyEmailFormSchema = z.object({
  code: z.string().min(6, 'Verification code is required').max(6, 'Invalid code'),
});

type VerifyEmailFormType = z.infer<typeof VerifyEmailFormSchema>;
type VerifyEmailFormProps = {
  defaultValues?: VerifyEmailFormType;
  onSubmit: (data: VerifyEmailFormType) => void;
};

const initialValues: VerifyEmailFormType = {
  code: '',
};

export default function VerifyEmailForm({
  defaultValues = initialValues,
  onSubmit,
}: VerifyEmailFormProps) {
  const form = useForm<VerifyEmailFormType>({
    resolver: zodResolver(VerifyEmailFormSchema),
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
          name="code"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Code</FormLabel>

              <FormControl>
                <Input placeholder="123456" type="text" {...field} />
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
          Verify Email
        </Button>
      </form>
    </Form>
  );
}
