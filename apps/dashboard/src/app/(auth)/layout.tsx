import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const { userId } = await auth();
  if (userId) {
    redirect('/app/dashboard');
  }
  return children;
}
