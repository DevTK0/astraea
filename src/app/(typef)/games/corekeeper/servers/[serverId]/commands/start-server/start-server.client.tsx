"use client";

import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { startServerAction } from "./start-server.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/(global)/components/ui/use-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { usePathSegments } from "@/(global)/hooks/path";

export function StartServerButton() {
    const { game, serverId } = usePathSegments();
    const queryClient = useQueryClient();

    const action = actionWithErrorHandling(startServerAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [game, serverId] });
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
            onClick={() => mutate({ game: game, serverId: serverId })}
        >
            {isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
                <Icons.play />
            )}
        </Button>
    );
}
