import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/css/utils";
import { JSX, ClassAttributes, HTMLAttributes } from "react";

export function PlayerList(
    props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement>
) {
    const playerList = [
        {
            name: "Player 1",
            id: 1,
            status: "Online",
            avatar: "https://github.com/shadcn.png",
            profile: "/users/1",
        },
        {
            name: "Player 2",
            id: 2,
            status: "Offline",
            avatar: "",
            profile: "/users/2",
        },
    ];
    return (
        <div {...props}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                <h1 className="text-xl font-semibold">Players</h1>
                {playerList.map((player) => (
                    <div
                        key={player.id}
                        className="flex flex-row items-center justify-start space-x-2"
                    >
                        <Avatar>
                            <AvatarImage src={player.avatar} alt="@shadcn" />
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                        <div>
                            <div>{player.name}</div>
                            <div
                                className={cn(
                                    "text-sm text-muted-foreground",
                                    player.status === "Online"
                                        ? "text-green-500"
                                        : ""
                                )}
                            >
                                {player.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
