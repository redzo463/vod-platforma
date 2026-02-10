import { Suspense } from "react"
import { VideoCard } from "@/components/shared/video-card"
import { FilterBar } from "@/components/shared/filter-bar"
import { db } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"

interface HomeProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
    const sp = await searchParams;
    const category = sp?.category as string | undefined;

    let whereClause = {};
    if (category && category !== "All") {
        whereClause = {
            category: {
                name: category
            }
        };
    }

    const videos = await db.video.findMany({
        where: whereClause,
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    const streams = await db.stream.findMany({
        where: {
            isLive: true,
            ...whereClause
        },
        include: { user: true }
    });

    return (
        <div className="h-full">
            <Suspense>
                <FilterBar />
            </Suspense>

            <div className="p-4 md:p-6 pt-0 space-y-8">
                {/* Live Section */}
                {streams.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold tracking-tight text-red-500 animate-pulse">Live Now</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {streams.map((stream) => (
                                <VideoCard
                                    key={stream.id}
                                    id={stream.id} // Stream ID for watching? Or User ID? Usually /user/username
                                    title={stream.name}
                                    thumbnailUrl={stream.thumbnailUrl}
                                    author={{
                                        username: stream.user.username,
                                        imageUrl: stream.user.imageUrl || undefined
                                    }}
                                    isLive={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Videos Section */}
                <div>
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {category && category !== "All" ? `${category} Videos` : "Recommended"}
                        </h1>
                    </div>
                    {videos.length === 0 && streams.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            No content found for this category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {videos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    id={video.id}
                                    title={video.title}
                                    thumbnailUrl={video.thumbnailUrl}
                                    author={{
                                        username: video.user.username,
                                        imageUrl: video.user.imageUrl || undefined
                                    }}
                                    views={video.views}
                                    date={formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
