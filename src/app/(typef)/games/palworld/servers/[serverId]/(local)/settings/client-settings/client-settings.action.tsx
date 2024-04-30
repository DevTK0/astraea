"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { ServerError } from "@/(global)/lib/exception/next-safe-action";
import {
    checkIfClientIsRunning,
    getServerSettings,
} from "@/(global)/lib/palworld/rest-api";
import {
    getServerStatus,
    restartServer,
    updatePalworldSettings,
    userSettingsSchema,
} from "@/(global)/lib/cloud-provider/server";
import { configs } from "@/(global)/configs/servers/palworld";

const isServerRunningSchema = z.object({});

export const isServerRunningAction = action(
    isServerRunningSchema,
    async ({}) => {
        const server = await getServerStatus(configs.game, configs.serverId);

        return server.status === "Running" ? server.ipAddress : undefined;
    }
);

const getClientSettingsSchema = z.object({
    ipAddress: z.string().ip(),
});

export const getClientSettingsAction = action(
    getClientSettingsSchema,
    async ({ ipAddress }) => {
        return await getServerSettings(ipAddress);
    }
);

const setClientSettingsSchema = userSettingsSchema;

export const setClientSettingsAction = action(
    setClientSettingsSchema,
    async (clientSettings) => {
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
    }
);
