import { Navbar } from "@/components/layout/navbar";

export default function WatchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full flex flex-col">
            <Navbar />
            <div className="flex-1 pt-16 h-full">
                {children}
            </div>
        </div>
    );
}
