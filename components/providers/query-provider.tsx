"use client";

import {
  QueryClient, // Used to create a new instance of the query client, which manages the caching and fetching of data.
  QueryClientProvider, // A context provider that makes the QueryClient available to all components within its tree./
} from "@tanstack/react-query";

import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // useState hook to create and maintain a single instance of QueryClient
  const [queryClient] = useState(() => new QueryClient());
  return (
    // Provides the QueryClient to the React Query context, enabling data fetching and caching for children components
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// useState(() => new QueryClient()): Initializes the QueryClient lazily, ensuring it is only created once when the component is first rendered.
// This queryClient instance will be used to manage all data fetching and caching throughout the app.
