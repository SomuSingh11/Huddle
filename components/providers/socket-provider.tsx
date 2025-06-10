"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { io as ClientIO } from "socket.io-client"; // Imports the socket.io-client library as ClientIO to manage WebSocket connections.

type SocketContextType = {
  // Defines the shape of the context's value, which includes:
  socket: any | null; // Represents the Socket.IO instance, which could be any type or null.
  isConnected: boolean; //  A boolean to indicate if the socket is currently connected.
};

// Creates a context with an initial value of { socket: null, isConnected: false }.
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// A custom hook that provides access to the SocketContext. Components can use this hook to get the current socket instance and connection status.
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider: A React component that wraps its children with SocketContext.Provider.
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!, // Creates a new Socket.IO client instance using the URL from the environment variable NEXT_PUBLIC_SITE_URL.
      {
        path: "/api/socket/io", // The path option specifies the endpoint where the Socket.IO server is listening (/api/socket/io).
        addTrailingSlash: false,
      }
    );

    // Registers an event listener that sets isConnected to true when the socket successfully connects to the server.
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    // Registers an event listener that sets isConnected to false when the socket disconnects.
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance); // Stores the socket instance in the state, making it accessible throughout the component tree.

    return () => {
      socketInstance.disconnect(); // Disconnects the socket instance when the component is unmounted to prevent memory leaks or unnecessary network activity.
    };
  }, []);

  //  Wraps the children components with the context provider, passing down the socket instance and connection status (isConnected).
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Summary:
// This code is a React client component that creates a context provider (SocketProvider) to manage and share a Socket.IO client connection across the application.
// This setup allows different parts of the application to access the socket instance and monitor the connection status.
// ----> The SocketProvider component sets up the socket connection when it mounts using the useEffect hook.
// ----> The connection status is managed using the isConnected state, which gets updated upon connect/disconnect events.
// ----> useSocket is a custom hook to allow components to access the socket instance and the connection status from the context.
// ----> The socket is disconnected when the provider component unmounts to avoid any resource leaks.
