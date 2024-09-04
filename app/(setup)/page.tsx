import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  // Get the initial profile of the current user
  const profile = await initialProfile();

  // Search for the first server where the current user's profile is listed as a member
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id, // Match servers that include this profile in their members list
        },
      },
    },
  });

  // If the user is already a member of a server, redirect them to that server's page
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  // If no servers are found that currentUser is a member of them, display a message prompting the user to create a server
  return <div>Create a Server</div>;
};

export default SetupPage;
