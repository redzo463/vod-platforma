"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";

const getSelf = async () => {
  const self = await currentUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkId: self.id },
  });

  if (user) {
    return user;
  }

  // Fallback: Create user if not exists (for local dev without webhooks)
  // Ensure username is not null
  const username = self.username || `user_${self.id.slice(5, 10)}`;

  const newUser = await db.user.create({
    data: {
      clerkId: self.id,
      username: username,
      imageUrl: self.imageUrl,
    }
  });

  return newUser;
};

/**
 * Generates a new unique stream key for the user
 * note: userId argument is ignored in favor of authenticated user
 */
export async function generateStreamKey(userId: string) {
  try {
    const user = await getSelf();
    const streamKey = `live_${uuidv4().replace(/-/g, "")}`;

    await db.stream.update({
      where: { userId: user.id },
      data: { streamKey },
    });

    revalidatePath(`/studio/stream`);
    return { success: true, streamKey };
  } catch (error) {
    console.error("Failed to generate stream key", error);
    return { success: false, error: "Internal Error" };
  }
}

/**
 * Toggles the stream live status
 * note: userId argument is ignored in favor of authenticated user
 */
export async function toggleStreamStatus(userId: string, isLive: boolean) {
  try {
    const user = await getSelf();

    // Verify stream exists first
    const existing = await db.stream.findUnique({
      where: { userId: user.id }
    });

    if (!existing) {
      await getStream(userId); // Ensure it's created
    }

    await db.stream.update({
      where: { userId: user.id },
      data: { isLive },
    });

    revalidatePath("/");
    revalidatePath(`/studio`);
    revalidatePath(`/studio/stream`);

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle stream status", error);
    return { success: false, error: "Internal Error" };
  }
}

/**
 * Get current user's stream
 * note: userId argument is ignored in favor of authenticated user
 */
export async function getStream(userId: string) {
  try {
    const user = await getSelf();

    let stream = await db.stream.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!stream) {
      // Create a default stream if not exists
      stream = await db.stream.create({
        data: {
          userId: user.id,
          name: `${user.username}'s Stream`,
          ingressId: uuidv4(),
          serverUrl: "rtmp://live.voxo.com/app",
          streamKey: `live_${uuidv4().replace(/-/g, "")}`,
          isLive: false,
          isChatEnabled: true,
        },
        include: { user: true },
      });
    }

    return { success: true, stream };
  } catch (error) {
    console.error("Failed to get stream", error);
    return { success: false, error: "Internal Error" };
  }
}
