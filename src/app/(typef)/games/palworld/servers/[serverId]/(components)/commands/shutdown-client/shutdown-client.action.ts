"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { shutdown } from "@/lib/palworld/rest-api";
import { getServerAddress } from "@/lib/cloud-provider/server";

const shutdownClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const shutdownClientAction = withErrorHandling(
    action(shutdownClientSchema, async ({ game, serverId }) => {
        const serverAddress = await getServerAddress(game, serverId);

        await shutdown(serverAddress, 10, "Server will shutdown in 10s.");
    })
);
