import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col h-full h-screen overflow-hidden">
            <Navbar />
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* We can use a specialized StudioSidebar here later */}
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-3xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background -z-10 pointer-events-none" />
                    {children}
                </main>
            </div>
        </div>
    )
}
