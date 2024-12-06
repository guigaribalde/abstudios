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
import { PasswordInput } from '@/components/ui/password-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordFormSchema = z.object({
  code: z.string().min(6, 'Verification code is required').max(6, 'Invalid code'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Z0-9]/i, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

type ResetPasswordFormType = z.infer<typeof ResetPasswordFormSchema>;
type ResetPasswordFormProps = {
  defaultValues?: ResetPasswordFormType;
  onSubmit: (data: ResetPasswordFormType) => void;
};

const initialValues: ResetPasswordFormType = {
  code: '',
  password: '',
  confirmPassword: '',
};

export default function ResetPasswordForm({
  defaultValues = initialValues,
  onSubmit,
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordFormSchema),
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>

              <FormControl>
                <PasswordInput placeholder="Your new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Confirm password</FormLabel>

              <FormControl>
                <PasswordInput placeholder="Confirm password" {...field} />
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
          Reset password
        </Button>
      </form>
    </Form>
  );
}
