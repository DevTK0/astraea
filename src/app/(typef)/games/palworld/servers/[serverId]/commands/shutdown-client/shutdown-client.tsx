"use client";

import { Label } from "@/(global)/components/ui/label";
import { Button } from "@/(global)/components/ui/button";
import { toast } from "@/(global)/components/ui/use-toast";
import { Icons } from "@/(global)/components/ui/icons";

import { useMutation } from "@tanstack/react-query";
import { shutdownClientAction } from "./shutdown-client.action";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { usePathSegments } from "@/(global)/hooks/path";

export function ShutdownClient() {
    const { game, serverId } = usePathSegments();
    const action = actionWithErrorHandling(shutdownClientAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Palworld client is shutting down...`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Shutdown</Label>
                <div className="text-sm text-muted-foreground">
                    Shuts down the Palworld client on the server.
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
                    <Icons.value_none />
                )}
            </Button>
        </div>
    );
}
