"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

import { useMutation } from "@tanstack/react-query";
import { updateServerAction } from "./update-server.action";

export function UpdateServer() {
    const game = "Palworld";
    const serverId = 1;
    const { toast } = useToast();

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: updateServerAction,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Server Updated. ${response}`,
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
    }, [isError]);

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Update</Label>
                <div className="text-sm text-muted-foreground">
                    Updates the server.
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
