"use client";
import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { Label } from "@/(global)/components/ui/label";
import { toast } from "@/(global)/components/ui/use-toast";
import { stopServerAction } from "./stop-server.action";
import { useMutation } from "@tanstack/react-query";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { configs } from "@/(global)/configs/servers/palworld";
import { useError } from "@/(global)/components/error-toast/error-toast";

export function StopServer() {
    const action = actionWithErrorHandling(stopServerAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server Stopping...`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Stop</Label>
                <div className="text-sm text-muted-foreground">
                    Stops the server.
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                className="w-[80px]"
                onClick={() =>
                    mutate({ game: configs.game, serverId: configs.serverId })
                }
            >
                {isPending ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                    <Icons.stop />
                )}
            </Button>
        </div>
    );
}
