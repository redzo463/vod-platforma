import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface VideoCardProps {
    id: string
    title: string
    thumbnailUrl?: string | null
    desc?: string | null
    author: {
        username: string
        imageUrl?: string | null
    }
    isLive?: boolean
    duration?: number
    views?: number | string
    date?: string
}

export const VideoCard = ({
    id,
    title,
    thumbnailUrl,
    author,
    isLive,
    duration,
    views = 0,
    date
}: VideoCardProps) => {

    const formattedDuration = duration
        ? new Date(duration * 1000).toISOString().substr(11, 5).replace(/^0(?:0:0?)?/, '')
        : "12:42";

    return (
        <div className="group flex flex-col gap-2">
            <Link href={`/watch/${id}`} className="relative aspect-video rounded-xl overflow-hidden bg-muted block">
                {isLive && (
                    <div className="absolute inset-0 ring-2 ring-red-600 z-10 rounded-xl pointer-events-none animate-pulse" />
                )}
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-muted-foreground">
                        <span className="text-4xl text-white/20">VOXO</span>
                    </div>
                )}

                {isLive ? (
                    <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded-sm text-[10px] font-bold text-white uppercase tracking-wide shadow-[0_0_10px_rgba(220,38,38,0.7)] z-20">
                        Live
                    </div>
                ) : (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium z-20">
                        {formattedDuration}
                    </div>
                )}

                {isLive && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white">
                        1.2k viewers
                    </div>
                )}
            </Link>

            <div className="flex gap-3 mt-1">
                <Avatar className={cn("h-9 w-9 border border-background", isLive && "ring-2 ring-red-600")}>
                    <AvatarImage src={author.imageUrl || undefined} />
                    <AvatarFallback>{author.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                    <Link href={`/watch/${id}`}>
                        <span className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </span>
                    </Link>
                    <Link href={`/user/${author.username}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {author.username}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                        {isLive ? (
                            <span className="text-red-500 font-medium">Streaming Now</span>
                        ) : (
                            <span>{typeof views === 'number' ? views.toLocaleString() : views} views • {date || "2 days ago"}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const VideoCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="aspect-video rounded-xl" />
            <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1 w-full">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-3 w-[40%]" />
                </div>
            </div>
        </div>
    )
}
