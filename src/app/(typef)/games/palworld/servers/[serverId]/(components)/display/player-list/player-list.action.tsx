"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { checkIfClientIsRunning, getPlayerList } from "@/lib/palworld/rest-api";
import { getServerAddress, getServerStatus } from "@/lib/cloud-provider/server";
import { configs } from "@/configs/servers/palworld";

const getPlayerListSchema = z.object({});

export const getPlayerListAction = withErrorHandling(
    action(getPlayerListSchema, async ({}) => {
        const server = await getServerStatus(configs.game, configs.serverId);

        if (server.status !== "Running") return [];

        const serverAddress = z.string().ip().parse(server.ipAddress);

        const isUp = await checkIfClientIsRunning(serverAddress);

        if (isUp) {
            return await getPlayerList(serverAddress);
        } else {
            return [];
        }
    })
);
