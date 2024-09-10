import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    // Update the server to remove the current profile from the members list
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // Ensure the current profile is not the server owner i.e., admin can't leave the server
        },
        members: {
          some: {
            profileId: profile.id, // Ensure the profile is a member of the server
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id, // Remove the member with the current profile ID
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
