"use client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { startServer } from "./start-server.action";
import { useEffect } from "react";

export function StartServer() {
    const { execute, result } = useAction(startServer);

    useEffect(() => {
        console.log("hi");
        execute({ serverId: 1 });
    }, []);

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Start</Label>
                <div className="text-sm text-muted-foreground">
                    Starts the server.
                </div>
            </div>
            <Button variant="secondary" size="sm" className="w-[80px]">
                <Icons.play />
            </Button>
        </div>
    );
}
