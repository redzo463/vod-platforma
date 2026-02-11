'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Compass, Film, PlaySquare, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/shared/logo"

const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Discover", href: "/discover" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: PlaySquare, label: "Studio", href: "/studio" },
    { icon: Film, label: "Shorts", href: "/shorts" },
]

// Mock following data for UI demonstration
const followingData = [
    { username: "Ninja", imageUrl: "https://github.com/shadcn.png", isLive: true, category: "Fortnite" },
    { username: "Pokimane", imageUrl: "https://github.com/shadcn.png", isLive: true, category: "VALORANT" },
    { username: "Sodapoppin", imageUrl: "https://github.com/shadcn.png", isLive: false, category: "Just Chatting" },
]

export const Sidebar = () => {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-72">
            <div className="p-4 md:hidden">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "group w-full justify-start gap-4 px-3 relative overflow-hidden transition-all duration-300",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            {/* Active Indicator Line */}
                            {pathname === item.href && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full shadow-[0_0_12px_rgba(var(--primary),0.6)]" />
                            )}

                            <item.icon className={cn(
                                "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                pathname === item.href ? "text-primary drop-shadow-sm" : "group-hover:text-foreground"
                            )} />
                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <Separator className="my-6" />

                <div className="px-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Following
                        </h3>
                    </div>
                    <div className="space-y-1">
                        {followingData.map((user) => (
                            <Link
                                key={user.username}
                                href={`/user/${user.username}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors group relative"
                            >
                                <div className="relative">
                                    <div className={cn(
                                        "h-8 w-8 relative rounded-full border border-border group-hover:border-primary/50 transition-colors overflow-hidden",
                                        user.isLive && "ring-2 ring-red-500 ring-offset-2 ring-offset-background"
                                    )}>
                                        <Image src={user.imageUrl} alt={user.username} fill className="object-cover" />
                                    </div>
                                    {user.isLive && (
                                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate group-hover:text-foreground transition-colors">
                                        {user.username}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate leading-none">
                                        {user.category}
                                    </p>
                                </div>
                                {user.isLive && (
                                    <div className="flex items-center gap-1">
                                        <div className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
                                        <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

