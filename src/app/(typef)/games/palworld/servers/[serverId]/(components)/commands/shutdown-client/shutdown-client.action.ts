"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { shutdown } from "@/lib/palworld/rest-api";

const shutdownClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const shutdownClientAction = withErrorHandling(
    action(shutdownClientSchema, async ({ game, serverId }) => {
        // get server address
        const serverAddress = "";

        await shutdown(serverAddress, 30, "Server will shutdown in 30s.");
    })
);
