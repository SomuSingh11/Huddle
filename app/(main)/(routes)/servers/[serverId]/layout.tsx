import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  // Fetch the server from the database using the server ID and check if the current profile is a member
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id, // Ensure that the profile is a member of the server
        },
      },
    },
  });

  // If the server is not found or the profile is not a member, redirect to the home page
  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full ">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 ">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:ml-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
