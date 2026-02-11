import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const getSelf = async () => {
    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkId: self.id },
    });

    if (!user) {
        // Fallback: Create user if running locally and webhook didn't catch it
        // Or if db was reset
        const newUser = await db.user.create({
            data: {
                clerkId: self.id,
                username: self.username,
                imageUrl: self.imageUrl,
            }
        });
        return newUser;
    }

    return user;
};

export const getSelfByUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: { username },
    });

    return user;
};
