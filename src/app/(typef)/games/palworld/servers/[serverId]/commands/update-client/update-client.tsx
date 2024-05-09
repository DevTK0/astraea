"use client";

import { Label } from "@/(global)/components/ui/label";
import { Button } from "@/(global)/components/ui/button";
import { toast } from "@/(global)/components/ui/use-toast";
import { Icons } from "@/(global)/components/ui/icons";

import { useMutation } from "@tanstack/react-query";
import { updateClientAction } from "./update-client.action";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { usePathSegments } from "@/(global)/hooks/path";

export function UpdateClient() {
    const { game, serverId } = usePathSegments();
    const action = actionWithErrorHandling(updateClientAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server is updating...`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Update</Label>
                <div className="text-sm text-muted-foreground">
                    Updates the Palworld client on the server.
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                className="w-[80px]"
                onClick={() => mutate({ game, serverId })}
            >
                {isPending ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                    <Icons.update />
                )}
            </Button>
        </div>
    );
}
