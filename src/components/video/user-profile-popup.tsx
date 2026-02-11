"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Clock, ShieldCheck, Diamond, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { addModerator, removeModerator, banUser, unbanUser } from "@/actions/moderation";

export interface ChatUser {
    id?: string;
    username: string;
    subscribers: number;
    diamonds: number;
    isMod: boolean;
    isVip: boolean;
}

interface UserProfilePopupProps {
    userData: ChatUser;
    isViewerMod: boolean;
    isViewerOwner: boolean; // Only owner can add mods
    streamerId?: string; // Required for bans if not owner (and not passed implicitly by action)
    children: React.ReactNode;
}

export const UserProfilePopup = ({
    userData,
    isViewerMod,
    isViewerOwner,
    streamerId,
    children
}: UserProfilePopupProps) => {
    const [isPending, startTransition] = useTransition();
    const [timeoutMins, setTimeoutMins] = useState("10");
    const [banDuration, setBanDuration] = useState("permanent");
    const [isModded, setIsModded] = useState(userData.isMod);

    const handleTimeout = () => {
        if (!userData.id) {
            toast.error("Cannot timeout mock user (ID missing)");
            return;
        }

        startTransition(async () => {
            try {
                await banUser(userData.id!, parseInt(timeoutMins), streamerId);
                toast.success(`Timed out ${userData.username} for ${timeoutMins} minutes.`);
            } catch (error) {
                toast.error("Failed to timeout user: " + (error as Error).message);
            }
        });
    };

    const handleBan = () => {
        if (!userData.id) {
            toast.error("Cannot ban mock user (ID missing)");
            return;
        }

        const duration = banDuration === "permanent" ? undefined :
            banDuration === "1day" ? 1440 :
                banDuration === "3days" ? 4320 :
                    10080; // 7 days

        const durationText = banDuration === "permanent" ? "permanently" : `for ${banDuration}`;

        startTransition(async () => {
            try {
                await banUser(userData.id!, duration, streamerId);
                toast.success(`Banned ${userData.username} ${durationText}.`);
            } catch (error) {
                toast.error("Failed to ban user: " + (error as Error).message);
            }
        });
    };

    const handleModToggle = () => {
        if (!userData.id) {
            toast.error("Cannot modify mock user (ID missing)");
            return;
        }
        if (!isViewerOwner) {
            toast.error("Only the streamer can manage moderators");
            return;
        }

        startTransition(async () => {
            try {
                if (isModded) {
                    await removeModerator(userData.id!);
                    toast.success(`Removed ${userData.username} as moderator.`);
                    setIsModded(false);
                } else {
                    await addModerator(userData.id!);
                    toast.success(`Added ${userData.username} as moderator.`);
                    setIsModded(true);
                }
            } catch (error) {
                toast.error("Failed to update moderator status: " + (error as Error).message);
            }
        });
    };

    // If viewer is NOT mod and NOT owner, they see simplified view
    // But we usually show stats anyway

    return (
        <Popover>
            <PopoverTrigger asChild className="cursor-pointer hover:underline">
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 drop-shadow-2xl border-primary/20" align="start">
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold uppercase relative">
                            {userData.username.charAt(0)}
                            {userData.isVip && <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5"><Diamond className="h-2 w-2 text-white fill-current" /></div>}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm flex items-center gap-1">
                                {userData.username}
                                {isModded && <ShieldCheck className="h-3 w-3 text-green-500 fill-current" />}
                            </h4>
                            <p className="text-xs text-muted-foreground">{isModded ? "Moderator" : "Viewer"}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-secondary/30 p-2 rounded text-center border border-border/50">
                            <p className="text-muted-foreground mb-1">Subscribers</p>
                            <p className="font-bold flex items-center justify-center gap-1">
                                <Users className="h-3 w-3" /> {userData.subscribers}
                            </p>
                        </div>
                        <div className="bg-secondary/30 p-2 rounded text-center border border-border/50">
                            <p className="text-muted-foreground mb-1">Diamonds</p>
                            <p className="font-bold flex items-center justify-center gap-1 text-cyan-400">
                                <Diamond className="h-3 w-3" /> {userData.diamonds.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Moderation Controls - Visible if viewer is mod OR owner */}
                    {(isViewerMod || isViewerOwner) && (
                        <div className="space-y-3">
                            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> Moderation
                            </h5>

                            {/* Timeout */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-muted-foreground">Timeout (1-300 mins)</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="300"
                                        className="h-7 text-xs"
                                        value={timeoutMins}
                                        onChange={(e) => setTimeoutMins(e.target.value)}
                                        disabled={isPending}
                                    />
                                    <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={handleTimeout} disabled={isPending}>
                                        <Clock className="h-3 w-3 mr-1" /> Timeout
                                    </Button>
                                </div>
                            </div>

                            {/* Ban */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-muted-foreground">Ban Duration</label>
                                <div className="flex gap-2">
                                    <select
                                        className="h-7 text-xs bg-background border border-input rounded px-2 w-full"
                                        value={banDuration}
                                        onChange={(e) => setBanDuration(e.target.value)}
                                        disabled={isPending}
                                    >
                                        <option value="1day">1 Day</option>
                                        <option value="3days">3 Days</option>
                                        <option value="7days">1 Week</option>
                                        <option value="permanent">Permanent</option>
                                    </select>
                                    <Button size="sm" variant="destructive" className="h-7 text-[10px]" onClick={handleBan} disabled={isPending}>
                                        <Trash2 className="h-3 w-3 mr-1" /> Ban
                                    </Button>
                                </div>
                            </div>

                            {/* Mod/Unmod - Only Owner */}
                            {isViewerOwner && (
                                <Button
                                    size="sm"
                                    variant={isModded ? "outline" : "default"}
                                    className="w-full h-7 text-[10px]"
                                    onClick={handleModToggle}
                                    disabled={isPending}
                                >
                                    {isModded ? "Remove Moderator" : "Add Moderator"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
