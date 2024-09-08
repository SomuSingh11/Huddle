import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  //The reason we're fetching server again (first in layout) here because we are going to use this <ServerSidebar />
  // component again when in Mobile Mode and mobile mode wont't have access to the above Parent Layout
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },

      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc", // ADMIN ----> MODERATOR ----> GUEST
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  // Filter channels by type (TEXT, AUDIO, VIDEO)
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // Filter out the current user from the members list to show only other members
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  // Find the role of the current user in the server
  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  // The UI rendering part: At this point, you can create the UI for displaying
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      {" "}
      Server Sidebar Component
    </div>
  );
};
