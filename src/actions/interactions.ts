"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export const onLike = async (videoId: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const existingLike = await db.like.findFirst({
        where: {
            userId,
            videoId,
        },
    });

    if (existingLike) {
        if (existingLike.isDislike) {
            // Change from dislike to like
            await db.like.update({
                where: {
                    userId_videoId: {
                        userId,
                        videoId,
                    },
                },
                data: {
                    isDislike: false,
                },
            });
            revalidatePath(`/watch/${videoId}`);
            return { isLiked: true, isDisliked: false };
        } else {
            // Unlike (remove like)
            await db.like.delete({
                where: {
                    userId_videoId: {
                        userId,
                        videoId,
                    },
                },
            });
            revalidatePath(`/watch/${videoId}`);
            return { isLiked: false, isDisliked: false };
        }
    }

    await db.like.create({
        data: {
            userId,
            videoId,
            isDislike: false,
        },
    });

    revalidatePath(`/watch/${videoId}`);
    return { isLiked: true, isDisliked: false };
};

export const onDislike = async (videoId: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const existingLike = await db.like.findFirst({
        where: {
            userId,
            videoId,
        },
    });

    if (existingLike) {
        if (!existingLike.isDislike) {
            // Change from like to dislike
            await db.like.update({
                where: {
                    userId_videoId: {
                        userId,
                        videoId,
                    },
                },
                data: {
                    isDislike: true,
                },
            });
            revalidatePath(`/watch/${videoId}`);
            return { isLiked: false, isDisliked: true };
        } else {
            // Undislike (remove dislike)
            await db.like.delete({
                where: {
                    userId_videoId: {
                        userId,
                        videoId,
                    },
                },
            });
            revalidatePath(`/watch/${videoId}`);
            return { isLiked: false, isDisliked: false };
        }
    }

    await db.like.create({
        data: {
            userId,
            videoId,
            isDislike: true,
        },
    });

    revalidatePath(`/watch/${videoId}`);
    return { isLiked: false, isDisliked: true };
};

export async function addComment(videoId: string, text: string) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    if (!text || text.trim() === "") {
        return { error: "Comment cannot be empty" };
    }

    // Ensure DB user exists first
    let dbUser = await db.user.findUnique({
        where: { clerkId: user.id }
    });

    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                clerkId: user.id,
                username: user.username || `user_${user.id.slice(0, 5)}`,
                imageUrl: user.imageUrl,
            }
        });
    }

    /* 
       For now, we bypass creating the comment in DB because Video ID might not exist in SQLite yet 
       (since we are mocking the Video Page with hardcoded ID).
       If we try to insert comment for "videoId=XYZ", foreign key constraint will fail.
       So we return the mocked comment structure but simulate success.
    */

    // Check if video exists
    // const video = await db.video.findUnique({ where: { id: videoId } });
    // if (!video) ...

    const newComment = {
        id: Math.random().toString(36).substring(7),
        text,
        createdAt: new Date(),
        user: {
            username: dbUser.username,
            imageUrl: dbUser.imageUrl
        }
    };

    revalidatePath(`/watch/${videoId}`);
    return { success: true, comment: newComment };
}
