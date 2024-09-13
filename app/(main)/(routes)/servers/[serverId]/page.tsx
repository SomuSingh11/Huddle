// "use client" is not used because this is Server side component
// If you route to : " /servers/[serverId] ", by default you'll get redirected to :
// " /servers/[serverId]/channels/[channelId] " where the defautl channel is "general"

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    auth().redirectToSignIn();
  }

  // Query the database to find the server where the current user is a member
  const server = await db.server.findUnique({
    where: {
      id: params?.serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general", // Find the channel with the name "general"
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  // Select the first "general" channel from the server's channels list
  const intitialChannel = server?.channels[0];

  // If the first channel is not "general", return null (no redirection)
  if (intitialChannel?.name !== "general") {
    return null;
  }

  // Redirect to the "general" channel's page based on serverId and channelId
  return redirect(
    `/servers/${params?.serverId}/channels/${intitialChannel.id}`
  );
};

export default ServerIdPage;
