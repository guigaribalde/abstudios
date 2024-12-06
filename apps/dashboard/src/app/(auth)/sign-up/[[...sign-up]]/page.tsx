'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Facebook from '@/lib/assets/facebook';
import Google from '@/lib/assets/google';
import { useSignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SignUpForm from './signup-form';

export default function Page() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  return (
    <div className="flex size-full items-center justify-center bg-engineering-dark-blue bg-cover bg-center bg-no-repeat">
      <Card className="flex w-full max-w-96 flex-col gap-8 p-9">
        <CardHeader className="flex flex-col gap-8 p-0">
          <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={128} height={64} />
          <div>
            <CardTitle className="text-2xl font-bold">Create a new account</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              <span>
                Already have an account?
              </span>
              <Link href="/sign-in" className="text-primary-500">Sign in</Link>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SignUpForm onSubmit={async (data) => {
            if (!isLoaded) {
              return;
            }

            try {
              await signUp.create({
                emailAddress: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
              });

              // Start the email verification process
              await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
              toast.success('Verification email sent! Please check your inbox.');
              router.push('/verify-email');
            } catch (error) {
              console.error('Error during sign up:', error);
              toast.error('Failed to create account. Please try again.');
            }
          }}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-8 p-0">
          <div className="flex w-full items-center justify-center gap-2">
            <Separator className="w-full max-w-8" />
            <span className="whitespace-nowrap text-sm text-gray-500">OR CONTINUE WITH</span>
            <Separator className="w-full max-w-8" />
          </div>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                if (!isLoaded) {
                  return;
                }
                await signUp.authenticateWithRedirect({
                  strategy: 'oauth_google',
                  redirectUrl: '/auth/callback',
                  redirectUrlComplete: '/auth/store',
                });
              }}
            >
              <Google />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                if (!isLoaded) {
                  return;
                }
                await signUp.authenticateWithRedirect({
                  strategy: 'oauth_facebook',
                  redirectUrl: '/auth/callback',
                  redirectUrlComplete: '/auth/store',
                });
              }}
            >
              <Facebook />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
