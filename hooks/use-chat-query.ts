import qs from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query"; // Importing useInfiniteQuery for handling infinite queries

import { useSocket } from "@/components/providers/socket-provider"; // Importing custom hook to manage WebSocket connections

interface ChatQueryProps {
  queryKey: string; // Key to identify the query in the cache
  apiUrl: string; // URL for the API endpoint
  paramKey: "channelId" | "conversation"; // Key used in the query string
  paramValue: string; // Value for the query parameter
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  // Function to fetch messages from the API
  const fetchMessages = async ({ pageParam = 0 }: { pageParam: number }) => {
    // Build the URL with query parameters including pagination (cursor) and the specified paramKey/value
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true } // Skip null values in the query string
    );

    const res = await fetch(url); // Fetch data from the constructed URL
    return res.json(); // Return the JSON response from the API
  };

  // Use the useInfiniteQuery hook to handle infinite scrolling or pagination
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey], // Unique key for this query, used for caching and refetching
      queryFn: fetchMessages, // Function that fetches data from the API
      getNextPageParam: (lastPage) => lastPage?.nextCursor, // Determine the next page parameter based on the last page's response
      refetchInterval: isConnected ? false : 1000, // Set refetch interval; if connected, disable refetching
      initialPageParam: 0, // Start pagination from page 0
    });

  // Return necessary properties and functions for managing and accessing chat data
  return {
    data, // Contains the data from the query.
    fetchNextPage, // Function to fetch the next page of data.
    hasNextPage, // Boolean indicating if there are more pages to fetch.
    isFetchingNextPage, // Boolean indicating if the next page is currently being fetched.
    status, // Current status of the query (e.g., 'loading', 'error', 'success').
  };
};
