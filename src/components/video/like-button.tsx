"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { onLike, onDislike } from "@/actions/interactions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
    videoId: string;
    initialLikes?: number;
    initialIsLiked?: boolean;
    initialIsDisliked?: boolean;
}

export const LikeButton = ({
    videoId,
    initialLikes = 0,
    initialIsLiked = false,
    initialIsDisliked = false
}: LikeButtonProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isDisliked, setIsDisliked] = useState(initialIsDisliked);

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { userId } = useAuth();

    const handleLike = () => {
        if (!userId) return router.push("/sign-in");

        // Optimistic update
        const wasLiked = isLiked;
        const wasDisliked = isDisliked;

        const newIsLiked = !wasLiked;

        setIsLiked(newIsLiked);
        setIsDisliked(false);

        if (newIsLiked) {
            setLikes((prev) => prev + 1);
        } else {
            setLikes((prev) => prev - 1);
        }

        startTransition(async () => {
            try {
                const result = await onLike(videoId);
                setIsLiked(result.isLiked);
                setIsDisliked(result.isDisliked);
                // Sync likes count with server if needed or keep optimistic
            } catch (error) {
                setIsLiked(wasLiked);
                setIsDisliked(wasDisliked);
                if (wasLiked) setLikes(l => l + 1); else setLikes(l => l - 1);
                toast.error("Something went wrong");
            }
        });
    };

    const handleDislike = () => {
        if (!userId) return router.push("/sign-in");

        const wasLiked = isLiked;
        const wasDisliked = isDisliked;

        const newIsDisliked = !wasDisliked;

        setIsDisliked(newIsDisliked);
        setIsLiked(false);

        if (wasLiked) {
            setLikes((prev) => prev - 1);
        }

        startTransition(async () => {
            try {
                const result = await onDislike(videoId);
                setIsLiked(result.isLiked);
                setIsDisliked(result.isDisliked);
            } catch (error) {
                setIsDisliked(wasDisliked);
                setIsLiked(wasLiked);
                if (wasLiked) setLikes(l => l + 1);
                toast.error("Something went wrong");
            }
        });
    };

    return (
        <div className="flex items-center bg-secondary rounded-full">
            <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleLike}
                className={cn(
                    "rounded-l-full gap-2 px-3 hover:bg-muted-foreground/10 transition",
                    isLiked && "text-primary bg-primary/10"
                )}
            >
                <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
                <span className="text-sm font-medium">{likes}</span>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-border/50" />
            <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleDislike}
                className={cn(
                    "rounded-r-full px-3 hover:bg-muted-foreground/10 transition",
                    isDisliked && "text-primary bg-primary/10"
                )}
            >
                <ThumbsDown className={cn("h-4 w-4", isDisliked && "fill-current")} />
            </Button>
        </div>
    );
};
