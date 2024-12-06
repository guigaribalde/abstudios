'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { GraduationCap, Home, Truck, Users, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/app/dashboard',
    icon: Home,
  },
  {
    title: 'Videos',
    url: '/app/videos',
    icon: Video,
  },
  {
    title: 'Users',
    url: '/app/users',
    icon: Users,
  },
  {
    title: 'Schools',
    url: '/app/schools',
    icon: GraduationCap,
  },
  {
    title: 'Shipments',
    url: '/app/shipments',
    icon: Truck,
  },
];

type AppSidebarProps = {
  currentPathName: string;
};

export function AppSidebar({ currentPathName }: AppSidebarProps) {
  const clientPathname = usePathname();
  const pathname = clientPathname || currentPathName;
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-fit pb-5 pt-3">
            <Image priority src="/AB_Studios_Full_Blue.png" alt="ABStudios Logo" width={96} height={48} />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {items.map(item => (
                <Link key={item.url} passHref href={item.url}>
                  <SidebarMenuItem
                    className={
                      cn(
                        'px-4 py-3 flex gap-3 items-center hover:bg-primary-50/30',
                        pathname.includes(item.url) ? 'border-l-[3px] border-solid border-primary bg-primary-50 hover:bg-primary-50/60' : '',
                      )
                    }
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
