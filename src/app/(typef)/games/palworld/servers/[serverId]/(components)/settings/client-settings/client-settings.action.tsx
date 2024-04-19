"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import {
    ServerError,
    withErrorHandling,
} from "@/lib/error-handling/next-safe-action";
import { checkIfClientIsRunning } from "@/lib/palworld/rest-api";
import {
    getServerStatus,
    restartServer,
    updatePalworldSettings,
} from "@/lib/cloud-provider/server";
import { configs } from "@/configs/servers/palworld";
import { setClientSettingsSchema } from "./client-settings.schema";
import { getClientStatusAction } from "../../overview/client-status/client-status.action";

export const getClientSettingsAction = getClientStatusAction;

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
