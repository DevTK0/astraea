"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { announceMessage } from "@/(global)/lib/palworld/rest-api";
import { getServerAddress } from "@/(global)/lib/cloud-provider/server";

const broadcastSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
    message: z.string(),
});

export const broadcastAction = action(
    broadcastSchema,
    async ({ game, serverId, message }) => {
        const serverAddress = await getServerAddress(game, serverId);

        await announceMessage(serverAddress, message);
    }
);
