"use client";

import { useQuery } from "@tanstack/react-query";
import { JSX, ClassAttributes, HTMLAttributes } from "react";
import {
    getClientMetricsAction,
    getClientSettingsAction,
    isClientRunningAction,
    isServerRunningAction,
} from "./client-status.action";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { usePathSegments } from "@/(global)/hooks/path";

export function ClientStatus({ className }: { className?: string }) {
    const { game, serverId } = usePathSegments();

    const {
        isError,
        isPending,
        data: ipAddress,
        error,
    } = useQuery({
        queryKey: ["palworld", "serverRunning"],
        queryFn: actionWithErrorHandling(() =>
            isServerRunningAction({ game, serverId })
        ),
        refetchInterval: 5000,
    });

    if (isPending) {
        return <div className={className}></div>;
    }

    if (isError) {
        return (
            <div className={className}>
                <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                    <h1 className="text-xl font-semibold">Client</h1>
                    <div className="text-red-500"> Error: {error?.message}</div>
                </div>
            </div>
        );
    }

    console.log(ipAddress);

    if (!ipAddress) {
        return <div className={className}></div>;
    }

    return (
        <div className={className}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                <h1 className="text-xl font-semibold">Client</h1>
                <RenderClientStatus ipAddress={ipAddress} />
            </div>
        </div>
    );
}

const RenderClientStatus = ({ ipAddress }: { ipAddress: string }) => {
    const {
        isError,
        isPending,
        data: isClientRunning,
        error,
    } = useQuery({
        queryKey: ["palworld", "clientRunning"],
        queryFn: actionWithErrorHandling(() =>
            isClientRunningAction({ ipAddress: ipAddress })
        ),
        refetchInterval: 5000,
    });

    if (isError) console.log(error.message);

    if (!isClientRunning) {
        return (
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3 bg-gray-500"></div>
                <div className="text-sm font-medium text-gray-500">Offline</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3 bg-green-500"></div>
                <div className="text-sm font-medium text-green-500">Online</div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2 ">
                <RenderClientSettings ipAddress={ipAddress} />
                <RenderClientMetrics ipAddress={ipAddress} />
            </div>
        </>
    );
};

const RenderClientSettings = ({ ipAddress }: { ipAddress: string }) => {
    const {
        isError,
        isPending,
        data: settings,
        error,
    } = useQuery({
        queryKey: ["palworld", "clientSettings"],
        queryFn: actionWithErrorHandling(() =>
            getClientSettingsAction({ ipAddress: ipAddress })
        ),
        refetchInterval: 5000,
    });

    return (
        <div className="rounded-lg border p-4 ">
            <div className="grid grid-cols-2">
                <div>Exp Rate </div>
                <div>{settings?.ExpRate}x</div>
                <div>Capture Rate </div>
                <div>{settings?.PalCaptureRate}x</div>
                <div>Work Speed Rate </div>
                <div>{settings?.WorkSpeedRate}x</div>
                <div>Drop Rate </div>
                <div>{settings?.EnemyDropItemRate}x</div>
                <div>Egg Hatch Rate</div>
                <div>{settings?.PalEggDefaultHatchingTime}x</div>
            </div>
        </div>
    );
};

const RenderClientMetrics = ({ ipAddress }: { ipAddress: string }) => {
    const {
        isError,
        isPending,
        data: metrics,
        error,
    } = useQuery({
        queryKey: ["palworld", "clientMetrics"],
        queryFn: actionWithErrorHandling(() =>
            getClientMetricsAction({ ipAddress: ipAddress })
        ),
        refetchInterval: 5000,
    });

    return (
        <div className="rounded-lg border p-4">
            <div className="grid grid-cols-2 ">
                <div>Server FPS </div>
                <div>{metrics?.serverfps}</div>
                <div>Uptime</div>
                <div>
                    {metrics ? (metrics?.uptime / 3600).toPrecision(2) : ""} hrs
                </div>
            </div>
        </div>
    );
};
