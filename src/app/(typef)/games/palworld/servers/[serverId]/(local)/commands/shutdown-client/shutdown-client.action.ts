"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { withErrorHandling } from "@/(global)/lib/error-handling/next-safe-action";
import { shutdown } from "@/(global)/lib/palworld/rest-api";
import { getServerAddress } from "@/(global)/lib/cloud-provider/server";

const shutdownClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const shutdownClientAction = action(
    shutdownClientSchema,
    async ({ game, serverId }) => {
        const serverAddress = await getServerAddress(game, serverId);

        await shutdown(serverAddress, 10, "Server will shutdown in 10s.");
    }
);
