"use client";

import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { toast } from "@/(global)/components/ui/use-toast";
import { cn } from "@/(global)/lib/css/utils";
import { ClassAttributes, HTMLAttributes } from "react";

import { getServerStatusAction } from "./server-status.action";
import type { ServerStatus } from "@/(global)/lib/cloud-provider/server";
import { useQuery } from "@tanstack/react-query";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { usePathSegments } from "@/(global)/hooks/path";

export function ServerStatus({
    className,
    portNum,
}: {
    className?: string;
    portNum: number;
}) {
    const { game, serverId } = usePathSegments();

    const {
        isPending,
        isError,
        data: server,
        error,
    } = useQuery({
        queryKey: [serverId, "serverStatus"],
        queryFn: actionWithErrorHandling(() =>
            getServerStatusAction({
                game: game,
                serverId: serverId,
            })
        ),
        refetchInterval: 5000,
    });

    return (
        <div className={className}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4">
                <div className="flex flex-row items-start justify-between w-full">
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold">Server</h1>
                        <RenderStatus
                            portNum={portNum}
                            isPending={isPending}
                            isError={isError}
                            server={server}
                            error={error}
                        />
                    </div>
                    <div
                        className={cn(
                            "rounded-lg border p-4 w-1/2 h-[300px] hidden md:block",
                            server?.status !== "Running" ? "md:hidden" : ""
                        )}
                    ></div>
                </div>
            </div>
        </div>
    );
}

const RenderStatus = ({
    portNum,
    isPending,
    isError,
    server,
    error,
}: {
    portNum: number;
    isPending: boolean;
    isError: boolean;
    server:
        | {
              status: ServerStatus;
              instanceType?: string | undefined;
              ipAddress?: string | undefined;
          }
        | undefined;
    error: { message: string } | null;
}) => {
    if (isPending) {
        return (
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3"></div>
                <div className="text-sm font-medium">Fetching...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3 bg-red-500"></div>
                <div className="text-sm font-medium text-red-500">
                    Error - {error?.message}
                </div>
            </div>
        );
    }

    if (server?.status === "Running") {
        return (
            <>
                <div className="flex items-center space-x-1">
                    <div className="rounded-full border w-3 h-3 bg-green-500"></div>
                    <div className="text-sm font-medium text-green-500">
                        {server?.status}
                    </div>
                </div>
                <div>
                    <div className="text-m text-muted-foreground">
                        {server?.instanceType}
                    </div>
                    <div className="flex items-center space-x-1">
                        <p className="text-sm">
                            {`${server.ipAddress}`}
                            <span className="font-bold">:{portNum} </span>
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (server.ipAddress === undefined) return;
                                navigator.clipboard.writeText(
                                    `${server.ipAddress}:${portNum}`
                                );
                                toast({
                                    description: "Copied to clipboard.",
                                });
                            }}
                        >
                            <Icons.copy />
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    if (server?.status === "Stopped" || server?.status === "Archived") {
        return (
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3 bg-gray-500"></div>
                <div className="text-sm font-medium text-gray-500">
                    {server?.status}
                </div>
            </div>
        );
    }

    if (server?.status === "Starting" || server?.status === "Stopping") {
        return (
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3 bg-yellow-300"></div>
                <div className="text-sm font-medium text-yellow-300">
                    {server?.status}
                </div>
            </div>
        );
    }
};
