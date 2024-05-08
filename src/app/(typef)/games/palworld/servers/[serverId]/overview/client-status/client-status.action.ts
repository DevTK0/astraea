"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import {
    checkIfClientIsRunning,
    getServerSettings,
    getServerMetrics,
} from "@/(global)/lib/palworld/rest-api";
import { getServerStatus } from "@/(global)/lib/cloud-provider/server";
import { configs } from "@/(global)/configs/servers/palworld";

const isServerRunningSchema = z.object({});

export const isServerRunningAction = action(
    isServerRunningSchema,
    async ({}) => {
        const server = await getServerStatus(configs.game, configs.serverId);

        return server.status === "Running" ? server.ipAddress : undefined;
    }
);

const isClientRunningSchema = z.object({ ipAddress: z.string().ip() });

export const isClientRunningAction = action(
    isClientRunningSchema,
    async ({ ipAddress }) => {
        const serverAddress = z.string().ip().parse(ipAddress);

        return await checkIfClientIsRunning(serverAddress);
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
