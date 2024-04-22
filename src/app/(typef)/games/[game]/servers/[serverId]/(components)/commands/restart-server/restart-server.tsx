import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { restartServerAction } from "./restart-server.action";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { configs } from "@/configs/servers/palworld";

export function RestartServer() {
    const { toast } = useToast();

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: restartServerAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server restarting...`,
            });
        },
    });

    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    }, [isError, error?.message, toast]);

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
                onClick={() =>
                    mutate({ game: configs.game, serverId: configs.serverId })
                }
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
