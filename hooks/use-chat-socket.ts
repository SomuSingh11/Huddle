import { useSocket } from "@/components/providers/socket-provider";
import { Member, Profile, Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Define the props for the useChatSocket hook
type ChatSocketProps = {
  addKey: string; // WebSocket event key for adding messages
  updateKey: string; // WebSocket event key for updating messages
  queryKey: string; // The React Query key used to identify cached chat data
};

// Define the structure of the message object, including nested member and profile information.
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

// Hook for managing real-time chat messages using WebSocket and React Query.
export const useChatSocket = ({
  addKey, // The event name that signals a new message has been added.
  updateKey, // The event name that signals a message has been updated.
  queryKey, // The key for the chat data in the React Query cache.
}: ChatSocketProps) => {
  const { socket } = useSocket(); // Get the socket instance from a custom socket provider.
  const queryClient = useQueryClient(); // Access the React Query client to manage cached data.

  useEffect(() => {
    // If the socket is not initialized, exit the effect.
    if (!socket) {
      return;
    }

    // Listen for the 'updateKey' event, which indicates that a message has been updated.
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      // Update the cache for the specified query key
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // If there is no existing data, or it's improperly formatted, return it unchanged.
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        // Create a new data array by mapping over the pages and updating the relevant message.
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              // Replace the old message with the updated one if IDs match.
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        // Return the updated data to the React Query cache.
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // Listen for the 'addKey' event, which indicates that a new message has been added.
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      // Update the cache for the specified query key.
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // If there is no existing data, create a new structure with the new message.
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        // Create a copy of the existing pages.
        const newData = [...oldData.pages];

        // Add the new message to the beginning of the first page's items.
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        // Return the updated data to the React Query cache.
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // Cleanup function: remove the event listeners when the component is unmounted or keys change.
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]); // Dependencies array to re-run effect if these values change.
};

// useChatSocket hook listens for WebSocket events related to chat messages using socket.io.
// When messages are added or updated in real-time (received through WebSocket events), the hook updates the corresponding React Query cache to reflect the changes in the UI.
