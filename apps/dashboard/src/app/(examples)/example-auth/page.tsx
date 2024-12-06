import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Page() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
