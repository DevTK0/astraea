"use server";
import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";
import { stopServer } from "@/lib/cloud-provider/server";

const stopServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const stopServerAction = withErrorHandling(
    action(stopServerSchema, async ({ game, serverId }) => {
        await stopServer(game, serverId);
    })
);
