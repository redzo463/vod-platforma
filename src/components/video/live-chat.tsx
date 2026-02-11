"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, MoreVertical, Users, Smile, Trash2, Clock, ShieldCheck, Diamond } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UserProfilePopup, ChatUser } from "./user-profile-popup";
import { v4 as uuidv4 } from "uuid";

const COLORS = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-orange-500",
    "text-purple-500",
];



interface ChatMessage {
    id: string;
    username: string;
    message: string;
    color?: string;
    isSystem?: boolean;
    badge?: "mod" | "sub" | "vip" | "staff" | null;
    userData?: ChatUser;
}

const generateRandomUserData = (username: string, badge?: string | null): ChatUser => {
    return {
        id: uuidv4(),
        username,
        subscribers: Math.floor(Math.random() * 500),
        diamonds: Math.floor(Math.random() * 10000),
        isMod: badge === "mod" || badge === "staff",
        isVip: badge === "vip",
    };
};



const ChatBadge = ({ type }: { type: ChatMessage["badge"] }) => {
    if (!type) return null;
    const styles = {
        mod: "bg-green-500/20 text-green-500 border-green-500/50",
        sub: "bg-primary/20 text-primary border-primary/50",
        vip: "bg-purple-500/20 text-purple-500 border-purple-500/50",
        staff: "bg-red-500 text-white border-red-600",
    }
    const icons = {
        mod: <ShieldCheck className="h-2 w-2" />,
        sub: "⭐",
        vip: <Diamond className="h-2 w-2" />,
        staff: "🛡️",
    }
    return (
        <span className={cn(
            "inline-flex items-center justify-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-bold mr-1.5 align-middle border",
            styles[type] || ""
        )}>
            {icons[type]}
            {type !== 'staff' && type?.toUpperCase()}
        </span>
    );
}

export const LiveChat = ({ streamerId }: { streamerId?: string }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: "1", username: "System", message: "Welcome to the Voxo chat! Follow the guidelines.", isSystem: true },
        {
            id: "2",
            username: "VoxoTeam",
            message: "New features are live!",
            color: "text-primary font-bold",
            badge: "staff",
            userData: { username: "VoxoTeam", subscribers: 99999, diamonds: 5000000, isMod: true, isVip: true }
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isMod, setIsMod] = useState(true); // Simulated mod status
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            const users = [
                { name: "GamerPro", badge: "sub" as const },
                { name: "NightBot", badge: "mod" as const },
                { name: "VoxoUser", badge: null },
                { name: "DiamondsRain", badge: "vip" as const }
            ];
            const msgs = ["POG!", "Let's gooo", "Love the setup", "💎💎💎", "Ban the troll lol"];

            const user = users[Math.floor(Math.random() * users.length)];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];

            addMessage(user.name, msg, COLORS[Math.floor(Math.random() * COLORS.length)], user.badge);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const addMessage = (username: string, message: string, color?: string, badge?: ChatMessage["badge"]) => {
        setMessages((prev) => [
            ...prev.slice(-100),
            {
                id: Math.random().toString(),
                username,
                message,
                color,
                badge,
                userData: generateRandomUserData(username, badge)
            }
        ]);
    };

    const deleteMessage = (id: string) => {
        setMessages((prev) => prev.filter(m => m.id !== id));
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const myData: ChatUser = {
            username: "You",
            subscribers: 1,
            diamonds: 100,
            isMod: true,
            isVip: false
        };

        setMessages((prev) => [
            ...prev,
            { id: Math.random().toString(), username: "You", message: inputValue, color: "text-primary font-bold", badge: "staff", userData: myData }
        ]);
        setInputValue("");
    };

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-3xl overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-border/40 flex justify-between items-center bg-secondary/10">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Stream Chat</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                        <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" scrollHideDelay={0}>
                <div className="space-y-1.5" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className="group relative flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all text-[13px] animate-in fade-in slide-in-from-bottom-1 duration-300">
                            {isMod && !msg.isSystem && (
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:scale-110 transition-all z-10"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            )}

                            <div className="flex-1 min-w-0">
                                {msg.isSystem ? (
                                    <p className="text-muted-foreground text-[11px] italic text-center py-2 bg-secondary/20 rounded-md border border-border/20">
                                        {msg.message}
                                    </p>
                                ) : (
                                    <div className="leading-relaxed">
                                        <ChatBadge type={msg.badge} />
                                        {msg.userData ? (
                                            <UserProfilePopup
                                                userData={msg.userData}
                                                isViewerMod={isMod}
                                                isViewerOwner={false}
                                                streamerId={streamerId}
                                            >
                                                <span className={cn("font-bold hover:underline cursor-pointer mr-2 inline-flex items-center gap-1", msg.color || "text-foreground")}>
                                                    {msg.username}:
                                                </span>
                                            </UserProfilePopup>
                                        ) : (
                                            <span className={cn("font-bold hover:underline cursor-pointer mr-2", msg.color || "text-foreground")}>
                                                {msg.username}:
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea >

            {/* Input Area */}
            < div className="p-4 bg-background/50 border-t border-border/30" >
                <form onSubmit={handleSend} className="relative group">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Send a message"
                        className="pr-12 h-11 bg-secondary/30 border-transparent focus:border-primary/50 focus:bg-background rounded-xl transition-all font-medium"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-muted-foreground hover:text-primary rounded-lg"
                        >
                            <Smile className="h-5 w-5" />
                        </Button>
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-primary hover:bg-primary/10 rounded-lg"
                            disabled={!inputValue.trim()}
                        >
                            <SendHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
                <div className="flex justify-between items-center mt-3 px-1">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded text-primary font-bold">
                            <Diamond className="h-3 w-3" />
                            <span>Shop</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Slow: 5s</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-8 bg-secondary rounded-full flex items-center px-1 overflow-hidden" title="Chat Volume">
                            <div className="h-1 w-full bg-primary/30 rounded-full" />
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

