import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, PlayCircle, DollarSign, TrendingUp, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function StudioPage() {
    return (
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Creator Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here&apos;s how your channel is performing.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl">Download Report</Button>
                    <Link href="/studio/stream">
                        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80">Go Live Now</Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Views", value: "124.5k", icon: Eye, change: "+12.5%", color: "text-blue-500" },
                    { title: "Subscribers", value: "1,204", icon: Users, change: "+4.2%", color: "text-purple-500" },
                    { title: "Avg. Watch Time", value: "42m", icon: PlayCircle, change: "+0.8%", color: "text-green-500" },
                    { title: "Earnings (Est.)", value: "$4,250.00", icon: DollarSign, change: "+18.4%", color: "text-red-500" },
                ].map((stat) => (
                    <Card key={stat.title} className="bg-secondary/20 border-border/50 backdrop-blur-sm hover:bg-secondary/30 transition-all group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground pt-1">
                                <span className="text-green-500 font-medium">{stat.change}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <Card className="lg:col-span-2 bg-secondary/10 border-border/40 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Recent Streams</CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1 rounded-full">View All <ChevronRight className="h-4 w-4" /></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/40">
                            {[
                                { title: "Playing Fortnite with Subs!", date: "2 hours ago", views: "1.2k", likes: "450" },
                                { title: "Chill Just Chatting - Ask me anything", date: "Yesterday", views: "3.4k", likes: "1.1k" },
                                { title: "Road to Diamond in Valorant", date: "3 days ago", views: "2.1k", likes: "890" },
                            ].map((stream) => (
                                <div key={stream.title} className="p-4 hover:bg-secondary/20 transition-colors flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className="h-10 w-16 bg-muted rounded-md overflow-hidden bg-[url('https://picsum.photos/seed/stream/200/100')] bg-cover" />
                                        <div>
                                            <p className="text-sm font-semibold">{stream.title}</p>
                                            <p className="text-xs text-muted-foreground">{stream.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 text-xs text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {stream.views}</span>
                                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {stream.likes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Monetization / Tips */}
                <Card className="bg-secondary/10 border-border/40 bg-gradient-to-br from-secondary/10 to-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Channel Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <h4 className="text-sm font-bold text-primary mb-1">Partner Program</h4>
                            <p className="text-xs text-muted-foreground mb-4">You&apos;re 84% away from becoming a verified partner.</p>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[84%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold">Top Benefactors</h4>
                            {[
                                { name: "KingGamer", diamonds: "12,400" },
                                { name: "LucyDiamond", diamonds: "8,200" },
                                { name: "ProStreamer42", diamonds: "5,100" },
                            ].map((user) => (
                                <div key={user.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-muted" />
                                        <span>{user.name}</span>
                                    </div>
                                    <span className="font-bold text-primary">{user.diamonds} ♦</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
