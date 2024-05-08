"use client";

import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { startServerAction } from "./start-server.action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/(global)/components/ui/use-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { configs } from "@/(global)/configs/servers/palworld";
import { useError } from "@/(global)/components/error-toast/error-toast";

export function StartServerButton() {
    const action = actionWithErrorHandling(startServerAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server starting...`,
            });
        },
    });

    useError(isError, error);

    return (
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
                <Icons.play />
            )}
        </Button>
    );
}
