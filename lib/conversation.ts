import { db } from "@/lib/db";

// Function to get an existing conversation or create a new one between two members
export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  // Try to find an existing conversation between the two members
  let conversation =
    (await findCoversation(memberOneId, memberTwoId)) ||
    (await findCoversation(memberTwoId, memberOneId));

  // If no conversation exists, create a new one
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

// Helper function to find an existing conversation between two members
const findCoversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true, // Include the profile of member one
          },
        },
        memberTwo: {
          include: {
            profile: true, // Include the profile of member two
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Helper function to create a new conversation between two members
const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true, // Include the profile of member one
          },
        },
        memberTwo: {
          include: {
            profile: true, // Include the profile of member two
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
