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
import { IpAddressType } from "@aws-sdk/client-ec2";

const isServerRunningSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const isServerRunningAction = action(
    isServerRunningSchema,
    async ({ game, serverId }) => {
        const server = await getServerStatus(game, serverId);

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
