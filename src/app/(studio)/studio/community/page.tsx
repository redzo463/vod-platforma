import { getBannedUsers, getModerators } from "@/actions/moderation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { ShieldOff, Lock, UserCheck } from "lucide-react";
import { RemoveModButton, UnbanButton } from "./_components/actions";

export default async function CommunityPage() {
    const bannedUsers = await getBannedUsers();
    const moderators = await getModerators();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Community Management</h1>
            <p className="text-muted-foreground">Manage your moderators and banned users.</p>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {/* Moderators Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Moderators
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {moderators.length}
                            </span>
                        </CardTitle>
                        <CardDescription>Users who can manage your chat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {moderators.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                                <ShieldOff className="h-8 w-8 opacity-50" />
                                No moderators yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Added</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {moderators.map((mod) => (
                                        <TableRow key={mod.id}>
                                            <TableCell className="flex items-center gap-2 font-medium">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={mod.user.imageUrl || ""} />
                                                    <AvatarFallback>{mod.user.username[0]}</AvatarFallback>
                                                </Avatar>
                                                {mod.user.username}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {format(new Date(mod.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <RemoveModButton userId={mod.userId} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Banned Users Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Banned Users
                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                {bannedUsers.length}
                            </span>
                        </CardTitle>
                        <CardDescription>Users blocked from your chat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {bannedUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                                <UserCheck className="h-8 w-8 opacity-50" />
                                No banned users.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bannedUsers.map((ban) => (
                                        <TableRow key={ban.id}>
                                            <TableCell className="flex items-center gap-2 font-medium">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={ban.user.imageUrl || ""} />
                                                    <AvatarFallback>{ban.user.username[0]}</AvatarFallback>
                                                </Avatar>
                                                {ban.user.username}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {ban.expiresAt ? (
                                                    <span className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                        Timeout
                                                    </span>
                                                ) : (
                                                    <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                        Permanent
                                                    </span>
                                                )}
                                                {ban.expiresAt && (
                                                    <div className="text-[10px] text-muted-foreground mt-1">
                                                        Until {format(new Date(ban.expiresAt), "MMM d, HH:mm")}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <UnbanButton userId={ban.userId} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
