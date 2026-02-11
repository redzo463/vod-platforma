"use client"

import Link from "next/link"
import { Menu, Search, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/shared/user-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Sidebar } from "./sidebar"
import { Logo } from "@/components/shared/logo"

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-background/80 backdrop-blur-md px-4 border-b border-border/50">
            <div className="flex items-center gap-4">
                {/* Mobile Sidebar Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden" suppressHydrationWarning>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <Sidebar />
                    </SheetContent>
                </Sheet>

                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="relative w-full">
                    <Input
                        placeholder="Search..."
                        className="w-full pl-10 bg-secondary/50 border-none focus-visible:ring-1"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <span className="text-xs font-bold text-primary group-hover:scale-110 transition-transform tracking-tight">1,240 ♦</span>
                </div>

                <Link href="/studio">
                    <Button variant="ghost" size="sm" className="hidden md:flex gap-2 rounded-full font-bold hover:bg-primary/10 hover:text-primary transition-all">
                        <Video className="h-4 w-4" />
                        Go Live
                    </Button>
                </Link>

                <UserMenu />
            </div>
        </nav>
    )
}
