import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";

interface ChannelIdPage {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPage) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  // Query the database to fetch the channel by its ID
  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId,
    },
  });

  // Query the database to check if the user is a member of the server
  const member = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id,
    },
  });

  // If the channel does not exist or the user is not a member, redirect to the homepage
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
