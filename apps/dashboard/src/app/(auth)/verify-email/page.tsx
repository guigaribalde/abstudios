'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignUp } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import VerifyEmailForm from './verify-email-form';

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  return (
    <div className="flex size-full items-center justify-center bg-engineering-dark-blue bg-cover bg-center bg-no-repeat">
      <Card className="flex w-full max-w-96 flex-col gap-8 p-9">
        <CardHeader className="flex flex-col gap-8 p-0">
          <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={128} height={64} />
          <div>
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              Please insert the code sent to your email.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <VerifyEmailForm onSubmit={async (data) => {
            if (!isLoaded) {
              return;
            }
            try {
              const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: data.code,
              });

              await setActive({ session: completeSignUp.createdSessionId });
              toast.success('Account created successfully!');
              router.push('/auth/store');
            } catch {
              toast.error('Something went wront...', {
                description: 'Make sure that the code is matching the one in your inbox',
              });
            }
          }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
