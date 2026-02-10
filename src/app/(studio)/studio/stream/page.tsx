"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Key, Copy, Eye, EyeOff, RefreshCcw, Server, ShieldCheck, Zap, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { generateStreamKey, toggleStreamStatus } from "@/actions/stream"
import { useUser } from "@clerk/nextjs"

export default function StreamSettingsPage() {
    const { user } = useUser()
    const [showKey, setShowKey] = useState(false)
    const [isLive, setIsLive] = useState(false)
    const [streamKey, setStreamKey] = useState("live_8472910_voxo_v3_x9z2p4q8r7")
    const [isPending, setIsPending] = useState(false)
    const serverUrl = "rtmp://live.voxo.com/app"

    const onCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    const onGenerateKey = async () => {
        if (!user) return;
        setIsPending(true)
        try {
            const res = await generateStreamKey(user.id)
            if (res.success && res.streamKey) {
                setStreamKey(res.streamKey)
                toast.success("New stream key generated")
            }
        } catch (error) {
            toast.error("Failed to generate key")
        } finally {
            setIsPending(false)
        }
    }

    const onToggleLive = async () => {
        if (!user) return;
        setIsPending(true)
        const newStatus = !isLive
        try {
            const res = await toggleStreamStatus(user.id, newStatus)
            if (res.success) {
                setIsLive(newStatus)
                toast.success(newStatus ? "You are now LIVE!" : "Stream stopped")
            }
        } catch (error) {
            toast.error("Failed to update status")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stream Settings</h1>
                    <p className="text-muted-foreground">Manage your stream configuration, keys, and security settings.</p>
                </div>
                <Button
                    onClick={onToggleLive}
                    disabled={isPending}
                    className={cn(
                        "rounded-xl px-8 h-12 font-bold shadow-lg transition-all",
                        isLive
                            ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                            : "bg-primary hover:bg-primary/90 shadow-primary/20"
                    )}
                >
                    {isLive ? (
                        <>
                            <Activity className="mr-2 h-5 w-5 animate-pulse" />
                            Stop Stream
                        </>
                    ) : (
                        <>
                            <Zap className="mr-2 h-5 w-5 fill-current" />
                            Go Live
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Connection Settings */}
                <Card className="bg-secondary/10 border-border/40 backdrop-blur-sm overflow-hidden border-l-4 border-l-primary/50">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <Server className="h-5 w-5 text-primary" />
                            <CardTitle>Ingest Configuration</CardTitle>
                        </div>
                        <CardDescription>Use these settings in your streaming software (OBS, vMix, etc.) to start your broadcast.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                Server URL
                                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            </label>
                            <div className="flex gap-2">
                                <Input readOnly value={serverUrl} className="font-mono bg-background/50 border-input/60" />
                                <Button variant="secondary" onClick={() => onCopy(serverUrl, "Server URL")}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Standard RTMP ingest for high compatibility and low latency.</p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                Stream Key
                                <ShieldCheck className="h-3 w-3 text-green-500" />
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type={showKey ? "text" : "password"}
                                        readOnly
                                        value={streamKey}
                                        className="font-mono bg-background/50 border-input/60 pr-10"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <Button variant="secondary" onClick={() => onCopy(streamKey, "Stream Key")}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-red-400 font-medium">NEVER share your stream key! Anyone with this key can stream to your channel.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/5 border-t border-border/40 p-6">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto gap-2 rounded-xl group"
                            onClick={onGenerateKey}
                        >
                            <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                            Reset Stream Key
                        </Button>
                    </CardFooter>
                </Card>

                {/* Additional Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-secondary/10 border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg">Latency Mode</CardTitle>
                            <CardDescription>Choose how you want your stream to be processed.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                                <div>
                                    <p className="text-sm font-bold text-primary">Ultra Low Latency</p>
                                    <p className="text-[11px] text-muted-foreground truncate">Best for real-time interaction (1-2s delay).</p>
                                </div>
                                < Zap className="h-5 w-5 text-primary fill-primary/20" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
                                <div>
                                    <p className="text-sm font-bold">Standard Latency</p>
                                    <p className="text-[11px] text-muted-foreground truncate">Higher quality, more stable (5-10s delay).</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/10 border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg">Mod Tools</CardTitle>
                            <CardDescription>Advanced chat and moderation features.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>Enabled: Emote-only mode, Slow mode (5s), Links filtering.</p>
                            <Button variant="link" className="p-0 h-auto text-primary text-xs">Configure Moderation Dashboard</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
