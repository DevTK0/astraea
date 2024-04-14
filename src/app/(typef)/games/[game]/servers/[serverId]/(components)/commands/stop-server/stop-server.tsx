import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { stopServerAction } from "./stop-server.action";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export function StopServer() {
    const game = "Palworld";
    const serverId = 1;
    const { toast } = useToast();

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: stopServerAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server Stopping...`,
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