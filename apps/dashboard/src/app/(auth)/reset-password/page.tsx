'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ResetPasswordForm from './reset-password-form';

export default function Page() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  return (
    <div className="flex size-full items-center justify-center bg-engineering-dark-blue bg-cover bg-center bg-no-repeat">
      <Card className="flex w-full max-w-[400] flex-col gap-8 p-9">
        <CardHeader className="flex flex-col gap-8 p-0">
          <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={128} height={64} />
          <div>
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              Please enter the 6-digit code sent to your email
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResetPasswordForm onSubmit={async (data) => {
            if (!isLoaded) {
              return;
            }
            try {
              await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: data.code,
                password: data.password,
              });
              toast.success('Password reseted!', {
                description: 'We\'ve authenticated you :)',
              });
              router.push('/app/dashboard');
            } catch {
              // TODO: Handle error when password is leaked
              toast.error('Failed to reset password!', {
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
