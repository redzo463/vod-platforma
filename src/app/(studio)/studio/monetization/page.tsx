"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Diamond, ArrowUpRight, Wallet, History, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MonetizationPage() {
    return (
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Monetization</h1>
                <p className="text-muted-foreground">Manage your earnings, subscriptions, and virtual currency from one place.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Earnings Summary */}
                <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Current Balance</CardTitle>
                            <CardDescription>Available for withdrawal</CardDescription>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold">$1,240.50</span>
                            <span className="text-muted-foreground font-medium">USD</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">Subscriptions (80%)</p>
                                <p className="text-xl font-bold">$940.00</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">Diamonds / Tips</p>
                                <p className="text-xl font-bold">$300.50</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold">Withdraw to Bank</Button>
                            <Button variant="outline" className="flex-1 rounded-xl h-12 border-primary/20">Payment Settings</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Virtual Currency (Diamonds) */}
                <Card className="bg-secondary/10 border-border/40 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Diamond className="h-24 w-24 text-primary" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Diamonds <Diamond className="h-4 w-4 text-primary fill-primary" />
                        </CardTitle>
                        <CardDescription>Virtual currency earnings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-primary">12,450</span>
                            <span className="text-xs text-muted-foreground font-bold">Total Earned</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Monthly Goal</span>
                                <span className="font-bold">85%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[85%] shadow-[0_0_15px_rgba(var(--primary),0.6)]" />
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center">Earn 15,000 diamonds to unlock the Emerald Badge.</p>
                        </div>

                        <Button variant="secondary" className="w-full rounded-xl gap-2 font-bold">
                            Convert to USD <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription Tiers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-secondary/10 border-border/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Subscription Settings</CardTitle>
                        <CardDescription>Configure your channel&apos;s monthly subscription tiers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { tier: "Tier 1", price: "$4.99", perks: "Standard emotes + Sub badge", active: 842 },
                            { tier: "Tier 2", price: "$9.99", perks: "All Tier 1 + Animated emote", active: 124 },
                            { tier: "Tier 3", price: "$24.99", perks: "Special VIP access + Custom command", active: 38 },
                        ].map((sub) => (
                            <div key={sub.tier} className="p-4 rounded-xl border border-border/50 hover:border-primary/40 transition-all flex items-center justify-between group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-lg">{sub.tier}</span>
                                        <span className="text-primary font-bold">{sub.price}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{sub.perks}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black group-hover:text-primary transition-colors">{sub.active}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Active Subs</p>
                                </div>
                            </div>
                        ))}
                        <Button variant="link" className="w-full text-primary font-bold">Edit Tiers & Perks</Button>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/10 border-border/40 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold">Payout History</CardTitle>
                        <History className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/30">
                            {[
                                { date: "Feb 1, 2024", amount: "$1,120.00", status: "Completed", method: "Bank Transfer" },
                                { date: "Jan 1, 2024", amount: "$940.50", status: "Completed", method: "PayPal" },
                                { date: "Dec 1, 2023", amount: "$1,450.00", status: "Completed", method: "Bank Transfer" },
                            ].map((payout, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{payout.amount}</p>
                                            <p className="text-xs text-muted-foreground">{payout.date} • {payout.method}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-green-500/20 text-green-500 border border-green-500/20">
                                        {payout.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
