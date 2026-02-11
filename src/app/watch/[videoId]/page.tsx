"use client"

import { VideoPlayer } from "@/components/player/video-player"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, MoreVertical, Layout, Heart, ShieldCheck, Users, Radio, ThumbsUp, ThumbsDown } from "lucide-react"
import { CommentSection } from "@/components/video/comment-section"
import { LiveChat } from "@/components/video/live-chat"
import { formatDistanceToNow } from "date-fns"
import { useState, use } from "react"
import { cn } from "@/lib/utils"

interface WatchPageProps {
    params: Promise<{
        videoId: string
    }>
}

export default function WatchPage({ params }: WatchPageProps) {
    const { videoId } = use(params)
    const [isTheaterMode, setIsTheaterMode] = useState(false)

    // Mock data for UI demonstration
    const video = {
        id: videoId,
        title: "Welcome to Voxo Live - The Ultimate Streaming Experience",
        muxPlaybackId: "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe",
        description: "Join us for an epic journey through the world of Voxo. Today we explore high-latency streaming, monetization, and advanced creator tools.",
        views: 1337,
        createdAt: new Date(),
        user: {
            id: "streamer-123",
            username: "VoxoTeam",
            imageUrl: "https://github.com/shadcn.png"
        }
    }

    return (
        <div className={cn(
            "flex flex-col gap-0 transition-all duration-500",
            isTheaterMode ? "p-0" : "p-4 md:p-6 lg:px-12 max-w-[1800px] mx-auto w-full"
        )}>
            <div className={cn(
                "flex flex-col lg:flex-row gap-6",
                isTheaterMode && "flex-col"
            )}>
                {/* Main Content */}
                <div className={cn(
                    "flex-1 min-w-0 flex flex-col",
                    isTheaterMode && "w-full"
                )}>
                    {/* Player Container */}
                    <div className={cn(
                        "relative bg-black transition-all duration-500 shadow-2xl overflow-hidden group border border-border/20",
                        isTheaterMode ? "aspect-[21/9] max-h-[80vh] w-full" : "aspect-video rounded-xl"
                    )}>
                        <VideoPlayer playbackId={video.muxPlaybackId} title={video.title} />

                        {/* Custom Player Controls Overlay */}
                        <div className="absolute top-4 right-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 h-8 w-8"
                                onClick={() => setIsTheaterMode(!isTheaterMode)}
                                title="Theater Mode"
                            >
                                <Layout className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "mt-4 space-y-4",
                        isTheaterMode && "px-4 md:px-12 max-w-[1200px] mx-auto w-full pb-10"
                    )}>
                        <div className="flex flex-col gap-4">
                            {/* Title and Live Badge */}
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight line-clamp-2">{video.title}</h1>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="bg-red-600 px-2 py-0.5 rounded text-white text-xs font-bold animate-pulse flex items-center gap-1">
                                        <Radio className="h-3 w-3" /> LIVE
                                    </div>
                                    <div className="text-xs font-mono text-primary flex items-center gap-1">
                                        <Users className="h-3 w-3" /> {video.views.toLocaleString()}
                                    </div>
                                </div>
                            </div>


                            {/* Streamer Info & Actions */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 ring-2 ring-primary p-0.5 bg-background">
                                            <AvatarImage src={video.user.imageUrl || ""} />
                                            <AvatarFallback>{video.user.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute -bottom-1 -right-1 bg-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold text-primary-foreground border-2 border-background">
                                            LIVE
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-base hover:underline cursor-pointer">{video.user.username}</span>
                                            <ShieldCheck className="h-4 w-4 text-green-500 fill-green-500/10" />
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">Streaming Overwatch 2</span>
                                    </div>

                                    <Button size="sm" className="rounded-sm font-bold ml-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-8 px-4 text-xs uppercase">
                                        Follow
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" size="sm" className="h-9 gap-2 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 border-none transition-colors">
                                        <Heart className="h-3.5 w-3.5 fill-current" />
                                        Subscribe
                                    </Button>

                                    <div className="flex items-center bg-secondary/50 rounded-md overflow-hidden border border-border/50">
                                        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-none gap-2 hover:bg-secondary/80 text-green-500">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span className="text-xs font-bold">1.2K</span>
                                        </Button>
                                        <div className="w-[1px] h-5 bg-border/50"></div>
                                        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-none hover:bg-secondary/80 text-muted-foreground hover:text-red-500">
                                            <ThumbsDown className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Description Panel */}
                        <div className="bg-card/30 rounded-xl p-4 text-sm relative group transition-all border border-border/30 hover:border-border/60">
                            <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">About this stream</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(video.createdAt, { addSuffix: true })}</span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed opacity-90 text-sm">
                                {video.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-primary">
                                <span className="bg-primary/10 px-2 py-1 rounded cursor-pointer hover:bg-primary/20">#gaming</span>
                                <span className="bg-primary/10 px-2 py-1 rounded cursor-pointer hover:bg-primary/20">#FPS</span>
                                <span className="bg-primary/10 px-2 py-1 rounded cursor-pointer hover:bg-primary/20">#Ranked</span>
                            </div>
                        </div>

                        {/* Comments (Hidden in Theater Mode) */}
                        <div className={cn("pt-4 block", isTheaterMode && "hidden")}>
                            <h3 className="font-bold text-lg mb-4">Comments</h3>
                            <CommentSection videoId={videoId} />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Chat */}
                <div className={cn(
                    "lg:w-[350px] xl:w-[400px] shrink-0 flex flex-col gap-6 transition-all duration-300",
                    isTheaterMode ? "fixed right-0 top-[60px] bottom-0 z-40 bg-background border-l border-border/50 w-[350px] shadow-2xl" : "h-auto"
                )}>
                    <div className={cn(
                        "flex flex-col bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm h-full",
                        isTheaterMode ? "rounded-none border-0 border-l h-full" : "h-[600px] lg:h-[calc(100vh-120px)] sticky top-24"
                    )}>
                        <LiveChat streamerId={video.user.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
