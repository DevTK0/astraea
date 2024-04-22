"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { startServerAction } from "./start-server.action";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export function StartServerButton() {
    const game = "Palworld";
    const serverId = 1;
    const { toast } = useToast();

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: startServerAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server starting...`,
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
