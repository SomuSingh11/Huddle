import { Server as NetServer } from "http"; // NetServer: Imported from the http module to use the existing HTTP server.
import { NextApiRequest } from "next"; // NextApiRequest: The default Next.js API request type.
import { Server as ServeIO } from "socket.io"; // ServeIO: The Server class from socket.io, renamed to ServeIO to avoid confusion with other Server imports.

import { NextApiResponseServerIo } from "@/types"; // A custom response type to extend the standard Next.js response object, adding support for the Socket.IO server.

// Disable Body Parsing: necessary because Socket.IO works with raw WebSocket connections, not HTTP POST data, so parsing the body is not required.
export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  // Check if Socket.IO server is already running
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const path = "/api/socket/io"; // The path variable defines the custom path (/api/socket/io) where Socket.IO will listen for incoming connections.
    const httpServer: NetServer = res.socket.server as any;

    // Initialize a new Socket.IO server with the HTTP server and custom path
    // Initialize Socket.IO server
    const io = new ServeIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_SITE_URL
            : "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    // Attach the new Socket.IO server to the response object's server
    res.socket.server.io = io;
  }

  // End the response since this handler doesn't need to return the data to client
  res.end();
};

export default ioHandler;

// Summary:
// This code checks if a Socket.IO server is already attached to the Next.js API response socket. If not, it initializes a new Socket.IO server,
// attaching it to the existing HTTP server and using a custom path (/api/socket/io). Finally, it ends the response.
