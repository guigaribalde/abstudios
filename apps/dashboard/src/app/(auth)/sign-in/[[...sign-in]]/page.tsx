'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Facebook from '@/lib/assets/facebook';
import Google from '@/lib/assets/google';
import { useSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SignInForm from './signin-form';

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  return (
    <div className="flex size-full items-center justify-center bg-engineering-dark-blue bg-cover bg-center bg-no-repeat">
      <Card className="flex w-full max-w-96 flex-col gap-8 p-9">
        <CardHeader className="flex flex-col gap-8 p-0">
          <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={128} height={64} />
          <div>
            <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              <span>
                Dont have an account yet?
              </span>
              <Link href="/sign-up" className="text-primary-500">Sign up</Link>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SignInForm onSubmit={async (data) => {
            if (!isLoaded) {
              return;
            }

            try {
              const result = await signIn.create({
                identifier: data.email,
                password: data.password,
              });

              if (result.status === 'complete' && result.createdSessionId) {
                await setActive({ session: result.createdSessionId });
                toast.success('Success!', { description: 'Redirecting you...' });
                router.push('/app/dashboard');
              }
            } catch {
              toast.error(
                'Ops. Something went wrong!',
                { description: 'Try signin up or try again later.' },
              );
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
                await signIn.authenticateWithRedirect({
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
                await signIn.authenticateWithRedirect({
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
