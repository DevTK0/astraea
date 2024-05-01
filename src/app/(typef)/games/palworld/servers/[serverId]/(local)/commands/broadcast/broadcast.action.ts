"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { broadcast } from "./broadcast.service";

const broadcastSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
    message: z.string(),
});

export const broadcastAction = action(
    broadcastSchema,
    async ({ game, serverId, message }) => {
        broadcast({ game, serverId, message });
    }
);
