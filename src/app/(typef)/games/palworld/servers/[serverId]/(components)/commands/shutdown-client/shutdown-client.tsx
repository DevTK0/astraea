"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

import { useMutation } from "@tanstack/react-query";
import { shutdownClientAction } from "./shutdown-client.action";

export function ShutdownClient() {
    const game = "Palworld";
    const serverId = 1;
    const { toast } = useToast();

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: shutdownClientAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Palworld client is shutting down...`,
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
