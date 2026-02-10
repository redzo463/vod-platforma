"use client"

import { notFound } from "next/navigation"
import { VideoPlayer } from "@/components/player/video-player"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, MoreVertical, Maximize, Layout, Heart, ShieldCheck } from "lucide-react"
import { VideoCard } from "@/components/shared/video-card"
import { LikeButton } from "@/components/video/like-button"
import { CommentSection } from "@/components/video/comment-section"
import { LiveChat } from "@/components/video/live-chat"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface WatchPageProps {
    params: {
        videoId: string
    }
}

export default function WatchPage({ params }: WatchPageProps) {
    const videoId = params.videoId
    const [isTheaterMode, setIsTheaterMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Mock data for UI demonstration
    const video = {
        id: videoId,
        title: "Welcome to Voxo Live - The Ultimate Streaming Experience",
        muxPlaybackId: "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe",
        description: "Join us for an epic journey through the world of Voxo. Today we explore high-latency streaming, monetization, and advanced creator tools.",
        views: 1337,
        createdAt: new Date(),
        user: {
            username: "VoxoTeam",
            imageUrl: "https://github.com/shadcn.png"
        }
    }

    const relatedVideos = [
        { id: "rv1", title: "Kick vs Twitch: The Battle", thumbnailUrl: "https://picsum.photos/seed/1/320/180", user: { username: "TechNews" } },
        { id: "rv2", title: "Building a Platform in 2024", thumbnailUrl: "https://picsum.photos/seed/2/320/180", user: { username: "CodeMaster" } },
    ]

    return (
        <div className={cn(
            "flex flex-col gap-0 transition-all duration-500",
            isTheaterMode ? "p-0" : "p-4 md:p-6 lg:px-12 max-w-[1800px] mx-auto"
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
                        "relative bg-black transition-all duration-500 shadow-2xl overflow-hidden group",
                        isTheaterMode ? "aspect-[21/9] max-h-[80vh] w-full" : "aspect-video rounded-2xl"
                    )}>
                        <VideoPlayer playbackId={video.muxPlaybackId} title={video.title} />

                        {/* Custom Player Controls Overlay (Simulated) */}
                        <div className="absolute top-4 right-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80"
                                onClick={() => setIsTheaterMode(!isTheaterMode)}
                                title="Theater Mode"
                            >
                                <Layout className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "mt-6 space-y-4",
                        isTheaterMode && "px-4 md:px-12 max-w-[1200px] mx-auto w-full pb-10"
                    )}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 flex-1">
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">{video.title}</h1>

                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 ring-2 ring-primary/20 p-0.5">
                                        <AvatarImage src={video.user.imageUrl || ""} />
                                        <AvatarFallback>{video.user.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-lg leading-none">{video.user.username}</span>
                                            <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
                                        </div>
                                        <span className="text-sm text-muted-foreground font-medium">1.2M followers</span>
                                    </div>
                                    <Button className="rounded-full font-bold ml-4 px-6 h-11 bg-white text-black hover:bg-white/90 shadow-xl transition-all hover:scale-105 active:scale-95 border-none">
                                        Follow
                                    </Button>
                                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 hidden sm:flex h-11 px-6">
                                        <Heart className="h-4 w-4 text-primary" />
                                        Subscribe
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center rounded-full bg-secondary/50 backdrop-blur-sm p-1 border border-border/50">
                                    <LikeButton
                                        videoId={video.id}
                                        initialLikes={1240}
                                        initialIsLiked={false}
                                        initialIsDisliked={false}
                                    />
                                </div>

                                <Button variant="secondary" className="rounded-full gap-2 px-6 h-10 bg-secondary/50 backdrop-blur-sm border border-border/50 hover:bg-secondary/80">
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                </Button>
                                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-secondary/50 border border-border/50">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="bg-secondary/20 rounded-2xl p-6 text-sm relative group cursor-pointer hover:bg-secondary/30 transition-all border border-border/30">
                            <div className="font-bold mb-2 flex items-center gap-3">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{video.views.toLocaleString()} views</span>
                                <span className="text-muted-foreground">{formatDistanceToNow(video.createdAt, { addSuffix: true })} ago</span>
                            </div>
                            <p className="line-clamp-2 group-hover:line-clamp-none transition-all duration-500 whitespace-pre-wrap leading-relaxed opacity-90">
                                {video.description}
                                {"\n\n"}
                                #gaming #streaming #voxo #tech
                            </p>
                        </div>

                        <div className="hidden lg:block pt-4">
                            <CommentSection videoId={videoId} />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={cn(
                    "lg:w-96 xl:w-[420px] shrink-0 flex flex-col gap-6",
                    isTheaterMode && "px-4 md:px-12 max-w-[1200px] mx-auto w-full pb-20 mt-6"
                )}>
                    <div className="h-[600px] lg:h-[calc(100vh-120px)] sticky top-20 flex flex-col bg-secondary/10 rounded-3xl border border-border/40 backdrop-blur-md overflow-hidden shadow-2xl">
                        <LiveChat />
                    </div>
                </div>
            </div>
        </div >
    )
}
