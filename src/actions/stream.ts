"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a new unique stream key for the user
 */
export async function generateStreamKey(userId: string) {
    try {
        const streamKey = `live_${uuidv4().replace(/-/g, "")}`;

        await db.stream.update({
            where: { userId },
            data: { streamKey }
        });

        return { success: true, streamKey };
    } catch (error) {
        console.error("Failed to generate stream key", error);
        return { success: false, error: "Internal Error" };
    }
}

/**
 * Toggles the stream live status
 */
export async function toggleStreamStatus(userId: string, isLive: boolean) {
    try {
        await db.stream.update({
            where: { userId },
            data: { isLive }
        });

        revalidatePath("/");
        revalidatePath(`/studio`);

        return { success: true };
    } catch (error) {
        console.error("Failed to toggle stream status", error);
        return { success: false, error: "Internal Error" };
    }
}
