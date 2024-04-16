"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/meta/gamedata";
import {
    ServerError,
    withErrorHandling,
} from "@/lib/error-handling/next-safe-action";
import {
    announceMessage,
    getPlayerList,
    banPlayer,
    unbanPlayer,
    save,
    getServerInfo,
    checkIfClientIsRunning,
} from "@/lib/palworld/rest-api";
import { getServerAddress, updatePalworld } from "@/lib/cloud-provider/server";

const updateClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const updateClientAction = withErrorHandling(
    action(updateClientSchema, async ({ game, serverId }) => {
        const serverAddress = await getServerAddress(game, serverId);

        const response = await checkIfClientIsRunning(serverAddress);

        if (response)
            throw new ServerError(
                "Client must be shutdown before performing updates."
            );

        await updatePalworld();
    })
);
