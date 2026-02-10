import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const categories = ["Gaming", "Music", "IRL", "Sports", "Creative", "News", "Technology"];

        for (const name of categories) {
            const exists = await db.category.findUnique({ where: { name } });
            if (!exists) {
                await db.category.create({ data: { name } });
            }
        }

        // Create a default user if not exists
        let user = await db.user.findFirst();
        if (!user) {
            user = await db.user.create({
                data: {
                    username: "VoxoDemo",
                    clerkId: "user_demo123", // Dummy ID
                    imageUrl: "https://github.com/shadcn.png",
                    role: "ADMIN"
                }
            });
        }

        // Create a default video if none exists
        const count = await db.video.count();
        let videoId = "";

        if (count === 0) {
            const video = await db.video.create({
                data: {
                    title: "Welcome to Voxo Live",
                    userId: user.id,
                    description: "This is fully functional VOD platform setup locally.",
                    muxPlaybackId: "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe", // Sample
                    thumbnailUrl: "https://picsum.photos/seed/setup/640/360",
                    duration: 120.5,
                    views: 1337
                }
            });
            videoId = video.id;
        } else {
            const v = await db.video.findFirst();
            if (v) videoId = v.id;
        }

        return NextResponse.json({ success: true, message: "Database seeded!", videoId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
    }
}
