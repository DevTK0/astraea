import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { broadcastAction } from "./broadcast.action";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Icons } from "@/components/ui/icons";

export function Broadcast() {
    const game = "Palworld";
    const serverId = 1;
    const { toast } = useToast();
    const [message, setMessage] = useState("");

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: broadcastAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Message sent.`,
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
                <Label className="text-base">Broadcast</Label>
                <div className="text-sm text-muted-foreground">
                    Sends a message to the entire server.
                </div>
            </div>
            <div className="flex flex-row items-center justify-between ">
                <Input
                    className="w-[300px]"
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
