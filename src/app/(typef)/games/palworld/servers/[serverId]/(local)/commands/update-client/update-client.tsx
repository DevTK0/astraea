"use client";

import { useEffect, useState } from "react";
import { Label } from "@/(global)/components/ui/label";
import { Button } from "@/(global)/components/ui/button";
import { useToast } from "@/(global)/components/ui/use-toast";
import { Icons } from "@/(global)/components/ui/icons";

import { useMutation } from "@tanstack/react-query";
import { updateClientAction } from "./update-client.action";

export function UpdateClient() {
    const game = "Palworld";
    const serverId = 1;
    const { toast } = useToast();

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: updateClientAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server is updating... ${response}`,
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
                <Label className="text-base">Update</Label>
                <div className="text-sm text-muted-foreground">
                    Updates the Palworld client on the server.
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
                    <Icons.update />
                )}
            </Button>
        </div>
    );
}
