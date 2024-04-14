"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { announceMessage } from "@/lib/palworld/rest-api";

const broadcastSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
    message: z.string(),
});

export const broadcastAction = withErrorHandling(
    action(broadcastSchema, async ({ game, serverId, message }) => {
        // get server address
        // const serverAddress = "";
        // await announceMessage(serverAddress, message);
    })
);
