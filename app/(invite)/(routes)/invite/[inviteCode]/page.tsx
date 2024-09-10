import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  // Check if the user is already a member of the server using the invite code
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // If the user is not a member, update the server to add the user as a guest
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id, // Associate the profile with the server as a guest
            role: MemberRole.GUEST,
          },
        ],
      },
    },
  });

  // After joining the server, redirect to the server page
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  // If the server was not found or updated, return null (Will handle errors here)
  return null;
};

export default InviteCodePage;
