"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/actions/interactions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    id: string;
    text: string;
    createdAt: Date;
    user: {
        username: string;
        imageUrl?: string | null;
    };
}

interface CommentSectionProps {
    videoId: string;
    initialComments?: Comment[];
}

export const CommentSection = ({ videoId, initialComments = [] }: CommentSectionProps) => {
    const { user } = useUser();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [inputStr, setInputStr] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputStr.trim()) return;

        startTransition(async () => {
            try {
                const result = await addComment(videoId, inputStr);
                if (result.success && result.comment) {
                    // @ts-ignore - casting simulated response
                    setComments((prev) => [result.comment, ...prev]);
                    setInputStr("");
                    toast.success("Comment added");
                } else {
                    toast.error(result.error || "Failed to comment");
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        });
    };

    return (
        <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">{comments.length} Comments</h3>

            {/* Comment Input */}
            <div className="flex gap-4 mb-8">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user?.username?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <Textarea
                        placeholder="Add a comment..."
                        value={inputStr}
                        onChange={(e) => setInputStr(e.target.value)}
                        className="resize-none min-h-[80px]"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !inputStr.trim()}
                            size="sm"
                        >
                            {isPending ? "Posting..." : "Comment"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.user.imageUrl || undefined} />
                            <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{comment.user.username}</span>
                                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-foreground">{comment.text}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">No comments yet. Be the first!</div>
                )}
            </div>
        </div>
    );
};
