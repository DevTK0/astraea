"use server";
import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";
import { restartServer } from "@/lib/cloud-provider/server";

const restartServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const restartServerAction = withErrorHandling(
    action(restartServerSchema, async ({ game, serverId }) => {
        await restartServer(game, serverId);
    })
);
