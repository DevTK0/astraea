import { useQuery } from "@tanstack/react-query";
import { JSX, ClassAttributes, HTMLAttributes } from "react";
import { getClientSettingsAction } from "./client-status.action";

export function ClientStatus(
    props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement>
) {
    const {
        isError,
        isPending,
        data: clientSettings,
        error,
    } = useQuery({
        queryKey: ["palworld", "client-settings"],
        queryFn: () => getClientSettingsAction({}),
    });

    if (isPending) {
        return <div {...props}></div>;
    }

    if (isError) {
        return (
            <div {...props}>
                <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                    <h1 className="text-xl font-semibold">Client</h1>
                    <div className="text-red-500"> Error: {error?.message}</div>
                </div>
            </div>
        );
    }

    if (!clientSettings?.isServerRunning) {
        return <div {...props}></div>;
    }

    return (
        <div {...props}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                <h1 className="text-xl font-semibold">Client</h1>
                <RenderClientStatus clientSettings={clientSettings} />
            </div>
        </div>
    );
}

const RenderClientStatus = ({
    clientSettings,
}: {
    clientSettings: Awaited<ReturnType<typeof getClientSettingsAction>>;
}) => {
    if (!clientSettings?.isClientRunning) {
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
                <RenderClientSettings clientSettings={clientSettings} />
                <RenderClientMetrics clientSettings={clientSettings} />
            </div>
        </>
    );
};

const RenderClientSettings = ({
    clientSettings,
}: {
    clientSettings: Awaited<ReturnType<typeof getClientSettingsAction>>;
}) => {
    const settings = clientSettings?.clientSettings;
    console.log(settings);
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

const RenderClientMetrics = ({
    clientSettings,
}: {
    clientSettings: Awaited<ReturnType<typeof getClientSettingsAction>>;
}) => {
    const metrics = clientSettings?.clientMetrics;

    console.log(metrics);

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
