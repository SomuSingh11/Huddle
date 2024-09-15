import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {
    profile: Profile;
  })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

// This represents the Server entity from the Prisma schema. It contains fields related to a server, such as id, name, etc.,
// depending on how the Server model is defined in the Prisma schema.

// & (Intersection Type): The & symbol in TypeScript is used to create an intersection type. It combines multiple types into a single type.
// In this case, it combines the Server type with an object that represents its associated members.

//members: (Member & { profile: Profile; })[]:
// members:: This defines a property called members on the Server entity. It's an array ([]) because a server can have multiple members.
// Member & { profile: Profile; }: Each element in the members array is a Member object (likely representing the relationship between a user and a server) combined with an additional `

// This type describes:
// A Server object.
// A members array, where each Member includes a nested profile (from the Profile model).

// net: Provides classes (Server and Socket) for working with low-level networking, used here to extend the Socket and NetServer types.
// NextApiResponse: Imported from next, it represents the response object in a Next.js API route.
// SocketIOServer: Imported from socket.io to add the Socket.IO server instance to the API response.

// Extension Details:
// NextApiResponse is the default response type for Next.js API routes.
// The response object (NextApiResponseServerIo) is extended to include a socket property.
// socket is further extended to include a server property.
// The server property now includes an io property, which is an instance of SocketIOServer.
// Purpose: This type extension allows a Next.js API response object to carry the Socket.IO server instance. This is useful when integrating Socket.IO into Next.js API routes, as it provides a way to access the Socket.IO server through the response object
