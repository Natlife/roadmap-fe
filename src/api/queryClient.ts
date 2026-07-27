import { QueryClient } from '@tanstack/react-query';

// Shared react-query client with sensible admin-console defaults.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000
    },
    mutations: {
      retry: 0
    }
  }
});

export default queryClient;
