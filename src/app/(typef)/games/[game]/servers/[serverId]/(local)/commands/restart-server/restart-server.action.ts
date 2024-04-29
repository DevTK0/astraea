"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { withErrorHandling } from "@/(global)/lib/error-handling/next-safe-action";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { restartServer } from "@/(global)/lib/cloud-provider/server";

const restartServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const restartServerAction = withErrorHandling(
    action(restartServerSchema, async ({ game, serverId }) => {
        await restartServer(game, serverId);
    })
);
