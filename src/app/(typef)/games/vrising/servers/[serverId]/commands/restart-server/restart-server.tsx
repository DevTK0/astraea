"use client";
import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { Label } from "@/(global)/components/ui/label";
import { restartServerAction } from "./restart-server.action";
import { toast } from "@/(global)/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { gamelist } from "@/(global)/meta/gamedata";
import { usePathname } from "next/navigation";
import { z } from "zod";

export function RestartServer() {
    const path = usePathname();
    const game = z.enum(gamelist).parse(path.split("/")[2]);
    const serverId = z.coerce.number().parse(path.split("/")[4]);

    const action = actionWithErrorHandling(restartServerAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server restarting...`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Restart</Label>
                <div className="text-sm text-muted-foreground">
                    Restarts the server.
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
                    <Icons.reload />
                )}
            </Button>
        </div>
    );
}
