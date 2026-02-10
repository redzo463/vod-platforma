'use client'



import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export const UserMenu = () => {
    return (
        <>
            <SignedIn>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-10 w-10"
                        }
                    }}
                />
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="secondary" className="gap-2 rounded-full px-4 hover:bg-primary/10 hover:text-primary transition-colors">
                        <UserCircle className="h-5 w-5" />
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )
}
