"use client";

import { Button } from "@/(global)/components/ui/button";
import { Input } from "@/(global)/components/ui/input";
import { Label } from "@/(global)/components/ui/label";
import { broadcastAction } from "./broadcast.action";
import { toast } from "@/(global)/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Icons } from "@/(global)/components/ui/icons";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { usePathSegments } from "@/(global)/hooks/path";

export function Broadcast() {
    const { game, serverId } = usePathSegments();

    const [message, setMessage] = useState("");

    const action = actionWithErrorHandling(broadcastAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Message sent.`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 items-start md:items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Broadcast</Label>
                <div className="text-sm text-muted-foreground">
                    Sends a message to the entire server.
                </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full md:w-[300px]">
                <Input
                    className="w-full"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() =>
                        mutate({
                            game: game,
                            serverId: serverId,
                            message: message,
                        })
                    }
                >
                    {isPending ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.paper_plane />
                    )}
                </Button>
            </div>
        </div>
    );
}
