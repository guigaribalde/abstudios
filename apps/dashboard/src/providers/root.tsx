'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type RootProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
