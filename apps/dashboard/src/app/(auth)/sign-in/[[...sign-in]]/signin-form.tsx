'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().default(false),
});

type SignInFormType = z.infer<typeof SignInFormSchema>;
type SignInFormProps = {
  defaultValues?: SignInFormType;
  onSubmit: (data: SignInFormType) => void;
};

const initialValues: SignInFormType = {
  email: '',
  password: '',
  remember: false,
};

export default function SignInForm({
  defaultValues = initialValues,
  onSubmit,
}: SignInFormProps) {
  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema),
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>

              <FormControl>
                <PasswordInput
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel style={{ marginTop: 0 }}>Remember me</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Link href="/forgot-password" className="text-sm text-primary-500">Forgot password?</Link>
          </div>
        </div>

        <Button
          className="mt-3 w-full"
          type="button"
          onClick={form.handleSubmit(onSubmit)}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
