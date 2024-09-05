import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server"; // Used for sending HTTP responses in Next.js

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db"; // Import the Prisma database client
import { MemberRole } from "@prisma/client"; // Importing roles from Prisma schema

// Async POST function to handle creating a new server
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),

        // Automatically create a general channel within the server
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },

        // Add the creator as a member with an ADMIN role
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
