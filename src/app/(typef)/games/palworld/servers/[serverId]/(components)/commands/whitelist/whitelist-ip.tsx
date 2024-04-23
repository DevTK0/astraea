"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getIpAddressAction, whitelistIp } from "./whitelist-ip.action";
import { getUser } from "@/lib/auth/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export function WhitelistIp() {
    const [ip, setIp] = useState("Searching...");

    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: whitelistIp,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `${response?.message}`,
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

    function handleWhitelistIp() {
        getUser().then((res) => {
            const userId = z.string().uuid().parse(res?.id);
            mutate({ ipAddress: ip, serverId: 1, userId: userId });
        });
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
                <RenderInput setIp={setIp} />
                <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={handleWhitelistIp}
                >
                    {isPending ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.plus />
                    )}
                </Button>
            </div>
        </div>
    );
}

const RenderInput = ({
    setIp,
}: {
    setIp: Dispatch<SetStateAction<string>>;
}) => {
    const {
        isError,
        isPending,
        data: ipAddress,
        error,
    } = useQuery({
        queryKey: ["ipAddress"],
        queryFn: () => getIpAddressAction({}),
    });

    if (ipAddress) {
        setIp(ipAddress);
    }

    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    }, [isError, error?.message, toast]);

    function handleManualIp(value: string) {
        setIp(value);
    }

    return (
        <Input
            placeholder={isPending ? "Searching..." : ipAddress}
            onChange={(e) => handleManualIp(e.target.value)}
            className="w-[300px]"
        />
    );
};
