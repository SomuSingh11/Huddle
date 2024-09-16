import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>; // Reference to the bottom element in the chat container
  shouldLoadMore: boolean; // Flag to check if more messages should be loaded
  loadMore: () => void; // Function to load more messages
  count: number; // The current number of messages in the chat
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false); // Tracks if the initial scroll has been performed

  // Handle scroll events to load more messages when the user scrolls to the top
  useEffect(() => {
    const topDiv = chatRef?.current;

    // Function to handle the scroll event
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      // If the user scrolls to the top and more messages can be loaded, trigger loadMore
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    // Add the scroll event listener to the chat container
    topDiv?.addEventListener("scroll", handleScroll);

    // Clean up by removing the scroll event listener when the component is unmounted or updated
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  // Handle automatic scrolling when new messages are added to the chat
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;

    // Function to determine if auto-scrolling should occur
    const shouldAutoScroll = () => {
      // If not initialized and the bottom element is present, initialize and scroll
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      // If the chat container is not available, do not scroll
      if (!topDiv) {
        return false;
      }

      // Calculate the distance from the bottom of the chat container
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    // Perform auto-scroll if conditions are met
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
