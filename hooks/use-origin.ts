import { useState, useEffect } from "react";

/**
 * A custom hook that provides the origin (base URL) of the current window.
 * The origin is determined from `window.location.origin` and is only accessible
 * on the client side, not during server-side rendering.
 */
export const useOrigin = () => {
  // State to track whether the component has mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set `mounted` to true after the component has mounted
  }, []);

  // `typeof window !== "undefined"` ensures that this code only runs in the browser
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin // Return the origin if available
      : "";

  // If the component has not mounted yet, return `null` to avoid rendering on the server side
  if (!mounted) {
    return null;
  }

  return origin;
};
