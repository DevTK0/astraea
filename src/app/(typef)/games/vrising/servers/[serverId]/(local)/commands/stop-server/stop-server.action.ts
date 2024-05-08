"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { stopServer } from "@/(global)/lib/cloud-provider/server";

const stopServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const stopServerAction = action(
    stopServerSchema,
    async ({ game, serverId }) => {
        await stopServer(game, serverId);
    }
);
