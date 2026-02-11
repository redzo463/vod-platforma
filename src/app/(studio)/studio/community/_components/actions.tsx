"use client";

import { removeModerator, unbanUser } from "@/actions/moderation";
import { Button } from "@/components/ui/button";
import { Trash, Unlock } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export const RemoveModButton = ({ userId }: { userId: string }) => {
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        startTransition(() => {
            removeModerator(userId)
                .then(() => toast.success("Moderator removed"))
                .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <Button
            disabled={isPending}
            onClick={onClick}
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
        >
            <Trash className="h-4 w-4" />
        </Button>
    );
};

export const UnbanButton = ({ userId }: { userId: string }) => {
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        startTransition(() => {
            unbanUser(userId)
                .then(() => toast.success("User unbanned"))
                .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <Button
            disabled={isPending}
            onClick={onClick}
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-primary"
        >
            <Unlock className="h-4 w-4 mr-2" />
            Unban
        </Button>
    );
};
