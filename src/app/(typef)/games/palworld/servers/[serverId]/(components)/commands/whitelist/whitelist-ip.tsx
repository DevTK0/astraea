"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { whitelistIp } from "./whitelist-ip.action";

export function WhitelistIp() {
    const [ip, setIp] = useState("Searching...");

    const { execute, status } = useAction(whitelistIp, {
        onSuccess: (result) => {
            toast({
                title: "Success",
                description: result.message,
            });
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    err.fetchError ||
                    err.serverError ||
                    JSON.stringify(err.validationErrors),
            });
        },
    });

    useEffect(() => {
        fetch("/users/ip")
            .then((res) => res.json())
            .then((res) => {
                setIp(res);
            });
    }, []);

    function handleManualIp(value: string) {
        setIp(value);
    }

    function handleWhitelistIp() {
        execute({ ipAddress: ip, serverId: 1, userId: 1 });
    }

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Whitelist</Label>
                <div className="text-sm text-muted-foreground">
                    Adds your IP address to the list of allowed IPs.
                </div>
            </div>
            <div className="flex flex-row items-center justify-between ">
                <Input
                    placeholder={ip}
                    onChange={(e) => handleManualIp(e.target.value)}
                    className="w-[300px]"
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={handleWhitelistIp}
                >
                    {status === "executing" ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.plus />
                    )}
                </Button>
            </div>
        </div>
    );
}
