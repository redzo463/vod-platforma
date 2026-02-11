"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const getSelfStats = async () => {
    const self = await currentUser();

    if (!self) {
        return { success: false, message: "User not found" };
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: self.id,
        },
        include: {
            _count: {
                select: {
                    subscribers: true,
                },
            },
        },
    });

    if (!user) {
        return { success: false, message: "User not found in database" };
    }

    return {
        success: true,
        data: {
            diamonds: user.diamonds,
            subscriberCount: user._count.subscribers,
        },
    };
};
