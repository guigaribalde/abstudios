import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import { headers } from 'next/headers';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get('x-url-pathname') as string;

  return (
    <SidebarProvider>
      <AppSidebar currentPathName={pathname} />
      <main className="relative flex h-screen w-full flex-col">
        <div className="flex w-full items-center justify-between px-6 py-4 shadow-md">
          <SidebarTrigger />
          <UserButton />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
