import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } } // Extract memberId from the route parameters
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url); // Parse search parameters from the request URL
    const { role } = await req.json(); // Extract role from the request body

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member Id Missing", { status: 400 });
    }

    // Update the server by changing the role of the specific member
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // Ensure that the user is the server owner/admin
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id, // Ensure that the profile being updated is not the current user's own profile
              },
            },
            data: {
              role: role, // Update the role of the member
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("MEMBERS_ID_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
