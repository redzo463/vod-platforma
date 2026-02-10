import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <Navbar />
            <div className="flex h-full pt-16">
                <div className="hidden md:flex w-72 shrink-0 flex-col fixed inset-y-0 z-40 mt-16">
                    <Sidebar />
                </div>
                <main className="flex-1 md:pl-72 h-full">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default HomeLayout
