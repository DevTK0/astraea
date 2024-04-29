"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { withErrorHandling } from "@/(global)/lib/error-handling/next-safe-action";
import {
    checkIfClientIsRunning,
    getPlayerList,
} from "@/(global)/lib/palworld/rest-api";
import {
    getServerAddress,
    getServerStatus,
} from "@/(global)/lib/cloud-provider/server";
import { configs } from "@/(global)/configs/servers/palworld";

const getPlayerListSchema = z.object({});

export const getPlayerListAction = action(getPlayerListSchema, async ({}) => {
    const server = await getServerStatus(configs.game, configs.serverId);

    if (server.status !== "Running") return [];

    const serverAddress = z.string().ip().parse(server.ipAddress);

    const isUp = await checkIfClientIsRunning(serverAddress);

    if (isUp) {
        return await getPlayerList(serverAddress);
    } else {
        return [];
    }
});
