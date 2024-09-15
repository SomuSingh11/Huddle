import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10; // Number of messages to retrieve in each batch

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url); // Parse URL parameters from the request

    // Retrieve the cursor and channelId from the search parameters
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID Missing", { status: 401 });
    }

    // Initialize an array to store messages
    let messages: Message[] = [];

    // If a cursor is provided, fetch the next batch of messages starting from that cursor
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH, // Limit the number of messages to the batch size
        skip: 1, // Skip the cursor itself to avoid including it in the response
        cursor: {
          id: cursor, // Set the cursor to start fetching from
        },
        where: {
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // If no cursor is provided, fetch the first batch of messages
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Determine the next cursor if there are more messages to fetch
    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id; // Set the next cursor to the ID of the last message in the batch
    }

    // Return the fetched messages and the next cursor as a JSON response
    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
