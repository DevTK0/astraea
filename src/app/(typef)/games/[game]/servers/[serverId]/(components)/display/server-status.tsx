import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/css/utils";
import { ClassAttributes } from "react";

import { getServerStatusAction } from "./server-status.action";
import type { ServerStatus } from "@/lib/cloud-provider/server";
import { useQuery } from "@tanstack/react-query";

export function ServerStatus(props: ClassAttributes<HTMLDivElement>) {
    const serverId = 1;
    const game = "Palworld";

    const {
        isPending,
        isError,
        data: server,
        error,
    } = useQuery({
        queryKey: ["server", serverId, "status"],
        queryFn: () =>
            getServerStatusAction({
                game: game,
                serverId: serverId,
            }),
    });

    const status = renderStatus(isPending, isError, server, error);

    return (
        <div {...props}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4">
                <div className="flex flex-row items-start justify-between w-full">
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold">Status</h1>
                        {status}
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

function renderStatus(
    isPending: boolean,
    isError: boolean,
    server:
        | {
              status: ServerStatus;
              instanceType?: string | undefined;
              ipAddress?: string | undefined;
          }
        | undefined,
    error: { message: string } | null
) {
    const { toast } = useToast();

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
                        <p className="text-sm">{server.ipAddress}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (server.ipAddress === undefined) return;
                                navigator.clipboard.writeText(server.ipAddress);
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
}
