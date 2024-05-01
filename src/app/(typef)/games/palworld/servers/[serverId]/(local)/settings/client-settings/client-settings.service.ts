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

export const isServerRunningSchema = z.object({});

export async function isServerRunning({}) {
    const server = await getServerStatus(configs.game, configs.serverId);

    return server.status === "Running" ? server.ipAddress : undefined;
}

export const getClientSettingsSchema = z.object({
    ipAddress: z.string().ip(),
});

export async function getClientSettings({
    ipAddress,
}: z.infer<typeof getClientSettingsSchema>) {
    return await getServerSettings(ipAddress);
}

export const setClientSettingsSchema = userSettingsSchema;

export async function setClientSettings(
    clientSettings: z.infer<typeof setClientSettingsSchema>
) {
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
