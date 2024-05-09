"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { shutdown } from "@/(global)/services/palworld/rest-api";
import { getServerAddress } from "@/(global)/lib/cloud-provider/server";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";

const shutdownClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const shutdownClientAction = action(
    shutdownClientSchema,
    async ({ game, serverId }) => {
        const serverAddress = await getServerAddress(game, serverId);

        try {
            await shutdown(serverAddress, 10, "Server will shutdown in 10s.");
        } catch (error) {
            console.error(error);
            throw new ServerError("Client is not running.");
        }
    }
);
