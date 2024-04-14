"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";

const updateServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const updateServerAction = withErrorHandling(
    action(updateServerSchema, async ({ game, serverId }) => {
        // shutdown server using api
        // run update script using aws server manager
    })
);
