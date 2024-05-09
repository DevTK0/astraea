"use client";

import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { Input } from "@/(global)/components/ui/input";
import { toast } from "@/(global)/components/ui/use-toast";
import { useState } from "react";
import { whitelistIpAction } from "./whitelist-ip.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWithErrorHandling } from "@/(global)/lib/request/fetch";

import { useError } from "@/(global)/components/error-toast/error-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { usePathSegments } from "@/(global)/hooks/path";

export function WhitelistIpComponent({ port }: { port: number }) {
    const { serverId } = usePathSegments();
    const [ip, setIp] = useState<string>("1.1.1.1");

    const action = actionWithErrorHandling(whitelistIpAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `${response?.message}`,
            });
        },
    });

    useError(isError, error);

    function handleWhitelistIp() {
        mutate({ ipAddress: ip, protocol: "udp", port, serverId });
    }

    return (
        <div className="flex flex-row items-center justify-between w-full md:w-[300px]">
            <RenderInput onIpChange={setIp} />
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
    );
}

const RenderInput = ({ onIpChange }: { onIpChange: (ip: string) => void }) => {
    const [manual, setManual] = useState(false);

    const {
        isError,
        isPending,
        data: ipAddress,
        error,
    } = useQuery({
        queryKey: ["ipAddress"],
        queryFn: () => fetchWithErrorHandling(`/users/ip`),
    });
    useError(isError, error);

    if (!manual && ipAddress) {
        onIpChange(ipAddress);
    }

    function handleManualIp(value: string) {
        setManual(true);
        onIpChange(value);
    }

    return (
        <Input
            placeholder={isPending ? "Searching..." : ipAddress}
            type="text"
            onChange={(e) => handleManualIp(e.target.value)}
        />
    );
};
