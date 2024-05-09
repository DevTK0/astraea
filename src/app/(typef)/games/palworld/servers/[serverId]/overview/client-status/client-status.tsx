"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getClientMetricsAction,
    getClientSettingsAction,
    getRunningIpAddressAction,
} from "./client-status.action";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { usePathSegments } from "@/(global)/hooks/path";

export function ClientStatus({ className }: { className?: string }) {
    return (
        <div className={className}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                <h1 className="text-xl font-semibold">Client</h1>
                <RenderClientStatus />
            </div>
        </div>
    );
}

const RenderClientStatus = () => {
    const { game, serverId } = usePathSegments();

    const { data: ipAddress } = useQuery({
        queryKey: [serverId, "ipAddress"],
        queryFn: actionWithErrorHandling(() =>
            getRunningIpAddressAction({ game, serverId })
        ),
        refetchInterval: 5000,
    });

    if (!ipAddress) {
        return (
            <div className="flex items-center space-x-1">
                <div className="rounded-full border w-3 h-3 bg-gray-500"></div>
                <div className="text-sm font-medium text-gray-500">Offline</div>
            </div>
        );
    }

    // const { data: settings } = useQuery({
    //     queryKey: [serverId, "settings"],
    //     queryFn: actionWithErrorHandling(() =>
    //         getClientSettingsAction({ ipAddress: ipAddress })
    //     ),
    // });

    return (
        <div className="flex items-center space-x-1">
            <div className="rounded-full border w-3 h-3 bg-green-500"></div>
            <div className="text-sm font-medium text-green-500">Online</div>
        </div>
    );

    // const { data: metrics } = useQuery({
    //     queryKey: [serverId, "metrics"],
    //     queryFn: actionWithErrorHandling(() =>
    //         getClientMetricsAction({ ipAddress: ipAddress })
    //     ),
    // });

    // return (
    //     <>
    //         <div className="flex items-center space-x-1">
    //             <div className="rounded-full border w-3 h-3 bg-green-500"></div>
    //             <div className="text-sm font-medium text-green-500">Online</div>
    //         </div>
    //         <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2 ">
    //             <div className="rounded-lg border p-4 ">
    //                 <div className="grid grid-cols-2">
    //                     <div>Exp Rate </div>
    //                     <div>{settings?.ExpRate}x</div>
    //                     <div>Capture Rate </div>
    //                     <div>{settings?.PalCaptureRate}x</div>
    //                     <div>Work Speed Rate </div>
    //                     <div>{settings?.WorkSpeedRate}x</div>
    //                     <div>Drop Rate </div>
    //                     <div>{settings?.EnemyDropItemRate}x</div>
    //                     <div>Egg Hatch Rate</div>
    //                     <div>{settings?.PalEggDefaultHatchingTime}x</div>
    //                 </div>
    //             </div>
    //             <div className="rounded-lg border p-4">
    //                 <div className="grid grid-cols-2 ">
    //                     <div>Server FPS </div>
    //                     <div>{metrics?.serverfps}</div>
    //                     <div>Uptime</div>
    //                     <div>
    //                         {metrics
    //                             ? (metrics?.uptime / 3600).toPrecision(2)
    //                             : ""}{" "}
    //                         hrs
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
};
