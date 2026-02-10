"use client";

import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId: string;
    title?: string;
}

export const VideoPlayer = ({ playbackId, title }: VideoPlayerProps) => {
    return (
        <div className="aspect-video relative rounded-xl overflow-hidden bg-black shadow-xl">
            <MuxPlayer
                playbackId={playbackId}
                metadata={{
                    video_title: title,
                    player_name: "Voxo Player",
                }}
                accentColor="#2563eb" // blue-600
                className="w-full h-full"
                autoPlay={false}
            />
        </div>
    );
};
