import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};

// The currentProfile function is a reusable utility that performs a common task:
// fetching the current user's profile from the database based on their authentication status

// -----> current-profile works only for app routing and this we need "current-profile-pages" for pages routing
