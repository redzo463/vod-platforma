"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";



export const addModerator = async (targetUserId: string) => {
    try {
        const self = await getSelf();

        if (self.id === targetUserId) {
            throw new Error("Cannot add self as moderator");
        }

        const existingMod = await db.moderator.findFirst({
            where: {
                userId: targetUserId,
                streamerId: self.id,
            },
        });

        if (existingMod) {
            throw new Error("Already a moderator");
        }

        const moderator = await db.moderator.create({
            data: {
                userId: targetUserId,
                streamerId: self.id,
            },
            include: { user: true },
        });

        revalidatePath(`/u/${self.username}`);
        return moderator;
    } catch {
        throw new Error("Internal Error");
    }
};

export const removeModerator = async (targetUserId: string) => {
    try {
        const self = await getSelf();

        if (self.id === targetUserId) {
            throw new Error("Cannot remove self as moderator");
        }

        const existingMod = await db.moderator.findFirst({
            where: {
                userId: targetUserId,
                streamerId: self.id, // Only remove from own channel
            },
        });

        if (!existingMod) {
            throw new Error("Not a moderator");
        }

        const moderator = await db.moderator.delete({
            where: {
                id: existingMod.id,
            },
            include: { user: true },
        });

        revalidatePath(`/u/${self.username}`);
        return moderator;
    } catch {
        throw new Error("Internal Error");
    }
};


const isModOrOwner = async (selfId: string, streamerId: string) => {
    if (selfId === streamerId) return true;

    const mod = await db.moderator.findFirst({
        where: {
            userId: selfId,
            streamerId: streamerId,
        },
    });

    return !!mod;
};

export const banUser = async (targetUserId: string, durationInMinutes?: number, streamerId?: string) => {
    try {
        const self = await getSelf();

        // If no streamerId provided, assume self (streamer banning on own channel)
        const channelId = streamerId || self.id;

        const isAuthorized = await isModOrOwner(self.id, channelId);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }

        if (channelId === targetUserId) {
            throw new Error("Cannot ban the streamer");
        }

        if (self.id === targetUserId) {
            throw new Error("Cannot ban self");
        }

        // Check if target is already banned
        const existingBan = await db.ban.findFirst({
            where: {
                userId: targetUserId,
                streamerId: channelId,
            },
        });

        let expiresAt: Date | null = null;
        if (durationInMinutes && durationInMinutes > 0) {
            expiresAt = new Date(Date.now() + durationInMinutes * 60 * 1000);
        }

        if (existingBan) {
            // Update existing ban (e.g. extension or change to perm)
            const ban = await db.ban.update({
                where: { id: existingBan.id },
                data: { expiresAt },
                include: { user: true },
            });
            return ban;
        }

        const ban = await db.ban.create({
            data: {
                userId: targetUserId,
                streamerId: channelId,
                expiresAt,
            },
            include: { user: true },
        });

        return ban;
    } catch {
        throw new Error("Internal Error");
    }
};

export const unbanUser = async (targetUserId: string, streamerId?: string) => {
    try {
        const self = await getSelf();
        const channelId = streamerId || self.id;

        const isAuthorized = await isModOrOwner(self.id, channelId);
        if (!isAuthorized) {
            throw new Error("Unauthorized");
        }

        if (self.id === targetUserId) {
            throw new Error("Cannot unban self");
        }

        const existingBan = await db.ban.findFirst({
            where: {
                userId: targetUserId,
                streamerId: channelId,
            },
        });

        if (!existingBan) {
            throw new Error("Not banned");
        }

        const ban = await db.ban.delete({
            where: { id: existingBan.id },
            include: { user: true },
        });

        return ban;
    } catch {
        throw new Error("Internal Error");
    }
};

export const getBannedUsers = async () => {
    const self = await getSelf();

    const bannedUsers = await db.ban.findMany({
        where: {
            streamerId: self.id,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return bannedUsers;
};

export const getModerators = async () => {
    const self = await getSelf();

    const moderators = await db.moderator.findMany({
        where: {
            streamerId: self.id,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return moderators;
};

// Staff Actions (For Voxo Staff to sanction accounts globally or per stream)
// Implementation Note: A global ban would be a property on the User model (e.g. isBanned: true)
// For now, I'll assume standard channel bans are sufficient unless "Sanction" means platform-wide ban. 
// Given the request "Voxo staff ... sanction streamers", this implies banning the streamer from streaming.

export const sanctionStreamer = async (targetUserId: string) => {
    try {
        const self = await getSelf();

        if (self.role !== "STAFF" && self.role !== "ADMIN") {
            throw new Error("Unauthorized: Staff Only");
        }

        // Example sanction: Disable their stream
        await db.stream.update({
            where: { userId: targetUserId },
            data: { isLive: false }, // Force stop stream
        });

        // Could also ban the user globally if User model has IsBanned field
        // For now, let's just force stop their stream as a "sanction" example.

        return { success: true };

    } catch {
        throw new Error("Internal Error");
    }
}
