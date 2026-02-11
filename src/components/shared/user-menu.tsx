"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import {
    UserCircle,
    LogOut,
    Settings,
    Diamond,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getSelfStats } from "@/actions/user";

export const UserMenu = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const router = useRouter();

    const [stats, setStats] = useState<{ diamonds: number; subscriberCount: number } | null>(null);

    useEffect(() => {
        if (user) {
            getSelfStats().then((res) => {
                if (res.success && res.data) {
                    setStats(res.data);
                }
            });
        }
    }, [user]);

    if (!isLoaded) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (!isSignedIn) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="gap-2 rounded-full px-4 hover:bg-primary/10 hover:text-primary transition-colors">
                        <UserCircle className="h-5 w-5" />
                        Sign In
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/sign-in")}>
                        Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/sign-up")}>
                        Sign Up
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all p-0 overflow-hidden">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} alt={user.username || "User"} />
                        <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* User Stats */}
                <div className="p-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-secondary/40 p-2 rounded-md text-center hover:bg-secondary/60 transition-colors cursor-default">
                        <p className="text-muted-foreground mb-1">Subscribers</p>
                        <p className="font-bold flex items-center justify-center gap-1.5 text-foreground">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            {stats ? stats.subscriberCount : "-"}
                        </p>
                    </div>
                    <div className="bg-secondary/40 p-2 rounded-md text-center hover:bg-secondary/60 transition-colors cursor-default">
                        <p className="text-muted-foreground mb-1">Diamonds</p>
                        <p className="font-bold flex items-center justify-center gap-1.5 text-cyan-400">
                            <Diamond className="h-3.5 w-3.5 fill-cyan-400/20" />
                            {stats ? stats.diamonds.toLocaleString() : "-"}
                        </p>
                    </div>
                </div>



                <DropdownMenuItem className="cursor-pointer" onClick={() => openUserProfile()}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Manage Account</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10" onClick={() => signOut({ redirectUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
