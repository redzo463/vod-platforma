import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { video } from "@/lib/mux";

export async function POST(_req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const upload = await video.uploads.create({
            new_asset_settings: {
                playback_policy: ["public"],
            },
            cors_origin: "*",
        });

        return NextResponse.json(upload);
    } catch (error) {
        console.error("[UPLOAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
