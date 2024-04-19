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

const getClientStatusSchema = z.object({});

export const getClientStatusAction = withErrorHandling(
    action(getClientStatusSchema, async ({}) => {
        const server = await getServerStatus(configs.game, configs.serverId);

        if (server.status !== "Running") return { isServerRunning: false };

        const serverAddress = z.string().ip().parse(server.ipAddress);

        const isUp = await checkIfClientIsRunning(serverAddress);

        if (isUp) {
            return {
                isServerRunning: true,
                isClientRunning: true,
                clientSettings: await getServerSettings(serverAddress),
                clientMetrics: await getServerMetrics(serverAddress),
            };
        } else {
            return {
                isServerRunning: true,
                isClientRunning: false,
                clientSettings: undefined,
            };
        }
    })
);
