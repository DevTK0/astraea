"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import {
    checkIfClientIsRunning,
    getServerSettings,
    getServerMetrics,
} from "@/(global)/services/palworld/rest-api";
import { getServerStatus } from "@/(global)/lib/cloud-provider/server";
import { gamelist } from "@/(global)/meta/gamedata";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";

const getRunningIpAddressSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

// will only return if client is running
export const getRunningIpAddressAction = action(
    getRunningIpAddressSchema,
    async ({ game, serverId }) => {
        const server = await getServerStatus(game, serverId);
        const serverAddress = z
            .string()
            .ip({ message: "Server is not running." })
            .parse(server.ipAddress);

        const isUp = await checkIfClientIsRunning(serverAddress);

        if (!isUp) return undefined;

        return serverAddress;
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

const getClientMetricsSchema = z.object({
    ipAddress: z.string().ip(),
});

export const getClientMetricsAction = action(
    getClientMetricsSchema,
    async ({ ipAddress }) => {
        return await getServerMetrics(ipAddress);
    }
);
