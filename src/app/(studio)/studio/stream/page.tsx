"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCcw,
  Server,
  ShieldCheck,
  Zap,
  Activity,
  MessageSquare,
  Users,
  Clock,
  Send,
  Radio,
  Settings,
  Diamond,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  generateStreamKey,
  toggleStreamStatus,
  getStream,
} from "@/actions/stream";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { UserProfilePopup, ChatUser } from "@/components/video/user-profile-popup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StreamData {
  id: string;
  serverUrl: string | null;
  streamKey: string | null;
  isLive: boolean;
  name: string;
}



export default function StreamSettingsPage() {
  const { user } = useUser();
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [streamKey, setStreamKey] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null); // For webcam preview

  // Modal State
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showChatRulesModal, setShowChatRulesModal] = useState(false);

  // Stream Quality State
  const [streamQuality, setStreamQuality] = useState("1080p60");

  // Chat Rules State
  const [autoModEnabled, setAutoModEnabled] = useState(true);
  const [bannedWords, setBannedWords] = useState("");

  // Chat State
  const [messages, setMessages] = useState<
    { user: string; text: string; color: string; userData?: ChatUser }[]
  >([
    {
      user: "System",
      text: "Welcome to the chat room!",
      color: "text-primary",
      userData: { username: "System", subscribers: 0, diamonds: 0, isMod: true, isVip: false }
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadStreamData();
    }
  }, [user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Generators for random user data
  const generateRandomUserData = (username: string): ChatUser => {
    return {
      id: uuidv4(),
      username,
      subscribers: Math.floor(Math.random() * 500),
      diamonds: Math.floor(Math.random() * 10000),
      isMod: Math.random() > 0.9,
      isVip: Math.random() > 0.8,
    };
  };

  // Auto-chat simulator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        if (Math.random() > 0.6) {
          const randomUsers = [
            "Viewer123",
            "FanBoy",
            "Mod_X",
            "Newbie",
            "Gamer_22",
            "Chloe_Star",
          ];
          const randomMsgs = [
            "Cool stream!",
            "What game is this?",
            "Poggers",
            "Nice play!",
            "LUL",
            "Clip that!",
            "Hi streamer!",
          ];
          const randomUser =
            randomUsers[Math.floor(Math.random() * randomUsers.length)];
          const randomMsg =
            randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
          const colors = [
            "text-blue-400",
            "text-red-400",
            "text-green-400",
            "text-yellow-400",
            "text-purple-400",
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          setMessages((prev) => {
            const newMsgs = [
              ...prev,
              {
                user: randomUser,
                text: randomMsg,
                color: randomColor,
                userData: generateRandomUserData(randomUser)
              },
            ];
            if (newMsgs.length > 100)
              return newMsgs.slice(newMsgs.length - 100); // Keep last 100
            return newMsgs;
          });
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Webcam access when Live
  useEffect(() => {
    if (isLive) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Webcam access denied", err));
    } else {
      // Stop tracks if not live
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isLive]);

  const loadStreamData = async () => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false); // Stop loading if no user
      return;
    }

    try {
      const res = await getStream(user.id);
      if (res.success && res.stream) {
        setStreamData(res.stream as any);
        setServerUrl(res.stream.serverUrl || "rtmp://live.voxo.com/app");
        setStreamKey(res.stream.streamKey || "");
        setIsLive(res.stream.isLive);
      }
    } catch (error) {
      console.error("Failed to load stream data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const onGenerateKey = async () => {
    if (!user) return;
    setIsPending(true);
    try {
      const res = await generateStreamKey(user.id);
      if (res.success && res.streamKey) {
        setStreamKey(res.streamKey);
        toast.success("New stream key generated");
      }
    } catch (error) {
      toast.error("Failed to generate key");
    } finally {
      setIsPending(false);
    }
  };

  const handleGoLive = () => {
    setShowConnectModal(true);
  };

  const onConfirmLive = async () => {
    if (!user) return;
    setIsPending(true);
    try {
      await toggleStreamStatus(user.id, true);
      setIsLive(true);
      toast.success("You are now LIVE!");
      setShowConnectModal(false);

      // Add initial chat message
      setMessages((prev) => [
        ...prev,
        {
          user: "System",
          text: "Stream started successfully.",
          color: "text-green-500",
          userData: { username: "System", subscribers: 0, diamonds: 0, isMod: true, isVip: false }
        },
      ]);
    } catch (error) {
      toast.error("Failed to start stream");
    } finally {
      setIsPending(false);
    }
  };

  const onStopStream = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to end the stream?")) return;

    setIsPending(true);
    try {
      await toggleStreamStatus(user.id, false);
      setIsLive(false);
      toast.success("Stream stopped");
      setMessages((prev) => [
        ...prev,
        {
          user: "System",
          text: "Stream ended.",
          color: "text-red-500",
          userData: { username: "System", subscribers: 0, diamonds: 0, isMod: true, isVip: false }
        },
      ]);
    } catch (error) {
      toast.error("Failed to stop stream");
    } finally {
      setIsPending(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Check for banned words
    if (autoModEnabled && bannedWords) {
      const banned = bannedWords.split(',').map(w => w.trim().toLowerCase());
      const hasBannedWord = banned.some(word => newMessage.toLowerCase().includes(word));
      if (hasBannedWord) {
        toast.error("Message contains banned words!");
        return;
      }
    }

    setMessages([
      ...messages,
      {
        user: user?.username || "You",
        text: newMessage,
        color: "text-foreground",
        userData: {
          id: user?.id,
          username: user?.username || "You",
          subscribers: 1, // Self always has at least 1 (themselves)
          diamonds: 500,
          isMod: true, // You are the streamer, so you are mod
          isVip: false
        }
      },
    ]);
    setNewMessage("");

    // Simulating random responses
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const randomUsers = ["Viewer123", "FanBoy", "Mod_X", "Newbie"];
        const randomMsgs = [
          "Cool stream!",
          "What game is this?",
          "Poggers",
          "Nice play!",
        ];
        const randomUser =
          randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const randomMsg =
          randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        setMessages((prev) => [
          ...prev,
          {
            user: randomUser,
            text: randomMsg,
            color: "text-blue-400",
            userData: generateRandomUserData(randomUser)
          },
        ]);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <Activity className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }



  // LIVE DASHBOARD VIEW
  if (isLive) {
    return (
      <div className="h-[calc(100vh-80px)] p-6 bg-background flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-2 text-white font-bold animate-pulse">
              <Radio className="h-4 w-4" />
              LIVE
            </div>
            <h1 className="text-2xl font-bold">
              {streamData?.name || "My Live Stream"}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm border-l pl-4 border-border/50">
              <Clock className="h-4 w-4" />
              <span>00:12:45</span>
            </div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm border-l pl-4 border-border/50">
              <Users className="h-4 w-4" />
              <span>1,240 Viewers</span>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={onStopStream}
            disabled={isPending}
          >
            End Live
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
          {/* Left: Stream Preview & Stats */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative group border border-border/20 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!videoRef.current?.srcObject && (
                  <p className="text-white/50 text-lg font-mono">
                    Initializing Preview...
                  </p>
                )}
              </div>
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-green-400 border border-green-500/30 z-10 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                {streamQuality}
              </div>
            </div>

            {/* Stream Controls / Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-card/50">
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Stream Health
                  </CardTitle>
                  <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
                    Excellent <Activity className="h-5 w-5" />
                  </div>
                </CardHeader>
              </Card>
              <Card className="bg-card/50">
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Session Views
                  </CardTitle>
                  <div className="text-2xl font-bold">4.2k</div>
                </CardHeader>
              </Card>
              <Card className="bg-card/50 col-span-1">
                <CardHeader className="py-2 px-4 flex flex-col justify-center h-full gap-2">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2 w-full justify-start" onClick={() => setShowChatRulesModal(true)}>
                      <Settings className="h-3 w-3" /> Chat Rules
                    </Button>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">Quality</span>
                      <Select value={streamQuality} onValueChange={setStreamQuality}>
                        <SelectTrigger className="h-8 text-xs flex-1 min-w-0">
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1080p60">1080p60</SelectItem>
                          <SelectItem value="720p60">720p60</SelectItem>
                          <SelectItem value="480p">480p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-1 h-full min-h-[500px] flex flex-col bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between bg-secondary/20">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Chat
              </h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowChatRulesModal(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className="text-sm">
                    {msg.userData ? (
                      <UserProfilePopup
                        userData={msg.userData}
                        isViewerMod={true}
                        isViewerOwner={true}
                        streamerId={user?.id}
                      >
                        <span className={cn("font-bold mr-2 hover:underline cursor-pointer inline-flex items-center gap-1", msg.color)}>
                          {msg.userData.isMod && <ShieldCheck className="h-3 w-3 inline" />}
                          {msg.user}:
                        </span>
                      </UserProfilePopup>
                    ) : (
                      <span className={cn("font-bold mr-2", msg.color)}>
                        {msg.user}:
                      </span>
                    )}
                    <span className="text-foreground/90">{msg.text}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            <div className="p-3 bg-secondary/10 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="bg-background/60"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div >

        {/* Chat Rules Modal */}
        < Dialog open={showChatRulesModal} onOpenChange={setShowChatRulesModal} >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chat Configuration</DialogTitle>
              <DialogDescription>Manage auto-mod settings and chat rules.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="automod" className="flex flex-col gap-1">
                  <span>Enable Auto-Mod</span>
                  <span className="font-normal text-xs text-muted-foreground">Automatically filter offensive messages</span>
                </Label>
                <Switch id="automod" checked={autoModEnabled} onCheckedChange={setAutoModEnabled} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banned-words">Banned Words (comma separated)</Label>
                <Textarea
                  id="banned-words"
                  placeholder="badword1, badword2, etc."
                  value={bannedWords}
                  onChange={(e) => setBannedWords(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowChatRulesModal(false)}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog >
      </div >
    );
  }

  // OFFLINE View (Updated with new components placeholders if needed, but keeping basic structure similar to before)
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent mb-2">
            Setup Your Stream
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect your software and start broadcasting to the world.
          </p>
        </div>
        <Button
          onClick={handleGoLive}
          size="lg"
          className="rounded-full px-10 py-6 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
        >
          <Zap className="mr-2 h-5 w-5 fill-current" />
          Start Streaming
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-secondary/10 border-border/40 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle>Connection Details</CardTitle>
              </div>
              <CardDescription>
                Enter these details into your streaming software (OBS,
                Streamlabs, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  Server URL
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    RTMP
                  </span>
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={serverUrl}
                    className="font-mono bg-background/50 border-input/60"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => onCopy(serverUrl, "Server URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
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
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => onCopy(streamKey, "Stream Key")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onGenerateKey}
                    title="Generate New Key"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Keep this key private. Anyone with it can stream to your
                  channel.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Open Chat Rules Button in Offline Mode too */}
            <Card className="bg-secondary/5 border-border/30 hover:bg-secondary/10 transition-colors cursor-pointer group" onClick={() => setShowChatRulesModal(true)}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Settings className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-semibold">Chat Rules</h3>
                <p className="text-xs text-muted-foreground">
                  Configure auto-mod and banned words
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-border/30 hover:bg-secondary/10 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-semibold">Stream Quality</h3>
                <Select value={streamQuality} onValueChange={setStreamQuality}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-input/60">
                    <SelectValue placeholder="Select Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p60">1080p 60fps</SelectItem>
                    <SelectItem value="720p60">720p 60fps</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-6">
          <Card className="bg-linear-to-br from-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-muted-foreground">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <p>
                  Copy the <strong>Server URL</strong> to your broadcasting
                  software.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <p>
                  Copy your unique <strong>Stream Key</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <p>
                  Start streaming in your software, then click{" "}
                  <strong>Start Streaming</strong> here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Go Live Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Ready to Stream?
            </DialogTitle>
            <DialogDescription className="text-center">
              Copy these credentials to your streaming software (OBS, Streamlabs).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
                  Server URL
                  <Button variant="ghost" size="sm" className="h-5 text-[10px] text-primary hover:text-primary/80 p-0" onClick={() => onCopy(serverUrl, "Server URL")}>Copy</Button>
                </label>
                <div className="flex gap-2">
                  <Input readOnly value={serverUrl} className="font-mono text-xs bg-muted/50 h-9" />
                  <Button size="sm" variant="secondary" className="h-9 w-9 shrink-0" onClick={() => onCopy(serverUrl, "Server URL")}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
                  Stream Key
                  <Button variant="ghost" size="sm" className="h-5 text-[10px] text-primary hover:text-primary/80 p-0" onClick={() => onCopy(streamKey, "Stream Key")}>Copy</Button>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKey ? "text" : "password"}
                      readOnly
                      value={streamKey}
                      className="font-mono text-xs bg-muted/50 h-9 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <Button size="sm" variant="secondary" className="h-9 w-9 shrink-0" onClick={() => onCopy(streamKey, "Stream Key")}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-green-500" /> Never share this key with anyone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium flex gap-2">
                <span className="shrink-0">⚠️</span>
                <span>After pasting these into OBS, click "Start Streaming" in OBS first, then click the button below.</span>
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConnectModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmLive}
              className="bg-primary w-full sm:w-auto font-bold px-8 hover:bg-primary/90"
            >
              I'm Live in OBS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-using Chat Rules Modal for offline view as well */}
      <Dialog open={showChatRulesModal} onOpenChange={setShowChatRulesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Configuration</DialogTitle>
            <DialogDescription>Manage auto-mod settings and chat rules.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="automod" className="flex flex-col gap-1">
                <span>Enable Auto-Mod</span>
                <span className="font-normal text-xs text-muted-foreground">Automatically filter offensive messages</span>
              </Label>
              <Switch id="automod" checked={autoModEnabled} onCheckedChange={setAutoModEnabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banned-words">Banned Words (comma separated)</Label>
              <Textarea
                id="banned-words"
                placeholder="badword1, badword2, etc."
                value={bannedWords}
                onChange={(e) => setBannedWords(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowChatRulesModal(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
