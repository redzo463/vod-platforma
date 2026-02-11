"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
// removed unused useState import if not needed, but keep if active use
// FilterBar uses useSearchParams so it SHOULD be wrapped in Suspense boundary if used inside a client component page, 
// but here it is just a client component.
// Actually, useRouter and useSearchParams are hooks.


const categories = [
    "All",
    "Gaming",
    "IRL",
    "Music",
    "Esports",
    "Creative",
    "Programming",
    "Just Chatting",
    "News",
    "Sports",
    "Technology",
    "Podcasts"
]

export const FilterBar = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const active = searchParams.get("category") || "All"

    const handleFilter = (category: string) => {
        if (category === "All") {
            router.push("/")
        } else {
            router.push(`/?category=${category}`)
        }
    }

    return (
        <div className="w-full sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-4">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 p-2 px-4">
                    {categories.map((category) => {
                        const isActive = active === category
                        return (
                            <Button
                                key={category}
                                variant={isActive ? "default" : "secondary"}
                                size="sm"
                                onClick={() => handleFilter(category)}
                                className={cn(
                                    "rounded-lg transition-all",
                                    isActive
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                )}
                            >
                                {category}
                            </Button>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
        </div>
    )
}
