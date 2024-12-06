'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ForgotPasswordForm from './forgot-password-form';

export default function Page() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  return (
    <div className="flex size-full items-center justify-center bg-engineering-dark-blue bg-cover bg-center bg-no-repeat">
      <Card className="flex w-full max-w-[400] flex-col gap-8 p-9">
        <CardHeader className="flex flex-col gap-8 p-0">
          <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={128} height={64} />
          <div>
            <CardTitle className="text-2xl font-bold">Forgotten your password?</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              Don’t worry, we’ll send you a message to
              help you reset your password.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ForgotPasswordForm onSubmit={async (data) => {
            if (!isLoaded) {
              return;
            }
            try {
              await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: data.email,
              });
              toast.success('Reset password email sent!', {
                description: 'Please check your inbox to get the reset code.',
              });
              router.push('/reset-password');
            } catch {
              toast.error('Failed to send reset password email', {
                description: 'Please try again or make sure you are registered in our platform.',
              });
            }
          }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
