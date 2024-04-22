"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import {
    checkIfClientIsRunning,
    getServerSettings,
    getServerMetrics,
} from "@/lib/palworld/rest-api";
import { getServerStatus } from "@/lib/cloud-provider/server";
import { configs } from "@/configs/servers/palworld";

const isServerRunningSchema = z.object({});

export const isServerRunningAction = withErrorHandling(
    action(isServerRunningSchema, async ({}) => {
        const server = await getServerStatus(configs.game, configs.serverId);

        return server.status === "Running" ? server.ipAddress : undefined;
    })
);

const isClientRunningSchema = z.object({ ipAddress: z.string().ip() });

export const isClientRunningAction = withErrorHandling(
    action(isClientRunningSchema, async ({ ipAddress }) => {
        const serverAddress = z.string().ip().parse(ipAddress);

        return await checkIfClientIsRunning(serverAddress);
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

const getClientMetricsSchema = z.object({
    ipAddress: z.string().ip(),
});

export const getClientMetricsAction = withErrorHandling(
    action(getClientMetricsSchema, async ({ ipAddress }) => {
        return await getServerMetrics(ipAddress);
    })
);
