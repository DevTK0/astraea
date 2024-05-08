"use client";
import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { Label } from "@/(global)/components/ui/label";
import { toast } from "@/(global)/components/ui/use-toast";
import { stopServerAction } from "./stop-server.action";
import { useMutation } from "@tanstack/react-query";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { usePathSegments } from "@/(global)/hooks/path";

export function StopServer() {
    const { game, serverId } = usePathSegments();

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
                onClick={() => mutate({ game: game, serverId: serverId })}
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
