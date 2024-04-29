"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import {
    ServerError,
    withErrorHandling,
} from "@/(global)/lib/error-handling/next-safe-action";
import {
    checkIfClientIsRunning,
    getServerSettings,
    serverSettingsSchema,
} from "@/(global)/lib/palworld/rest-api";
import {
    getServerStatus,
    restartServer,
    updatePalworldSettings,
} from "@/(global)/lib/cloud-provider/server";
import { configs } from "@/(global)/configs/servers/palworld";

const isServerRunningSchema = z.object({});

export const isServerRunningAction = withErrorHandling(
    action(isServerRunningSchema, async ({}) => {
        const server = await getServerStatus(configs.game, configs.serverId);

        return server.status === "Running" ? server.ipAddress : undefined;
    })
);

const getClientSettingsSchema = z.object({
    ipAddress: z.string().ip(),
});

export const getClientSettingsAction = withErrorHandling(
    action(getClientSettingsSchema, async ({ ipAddress }) => {
        return await getServerSettings(ipAddress);
    })
);

const setClientSettingsSchema = serverSettingsSchema.omit({
    ExpRate: true,
    PalCaptureRate: true,
    PalSpawnNumRate: true,
    EnemyDropItemRate: true,
    PalEggDefaultHatchingTime: true,
    WorkSpeedRate: true,
    ServerName: true,
    ServerDescription: true,
    PublicPort: true,
    PublicIP: true,
    RCONEnabled: true,
    RCONPort: true,
    Region: true,
    bUseAuth: true,
    BanListURL: true,
    RESTAPIEnabled: true,
    RESTAPIPort: true,
    bShowPlayerList: true,
    AllowConnectPlatform: true,
    bIsUseBackupSaveData: true,
    LogFormatType: true,
});

export const setClientSettingsAction = withErrorHandling(
    action(setClientSettingsSchema, async (clientSettings) => {
        const server = await getServerStatus(configs.game, configs.serverId);
        if (server.status !== "Running")
            throw new ServerError("Server is not running");
        const serverAddress = z.string().ip().parse(server.ipAddress);
        const isUp = await checkIfClientIsRunning(serverAddress);
        if (isUp)
            throw new ServerError(
                "Client must be shutdown before changing settings"
            );
        await updatePalworldSettings(clientSettings);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        await restartServer(configs.game, configs.serverId);
    })
);
