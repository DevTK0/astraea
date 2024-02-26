"use server";

import { getServerStatus } from "@/lib/cloud-provider/server";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/configs/games/gamelist";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";

const getServerStatusSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export type GetServerStatus = z.infer<typeof getServerStatusSchema>;

export const getServerStatusAction = withErrorHandling(
    action(getServerStatusSchema, async ({ game, serverId }) => {
        return await getServerStatus(game, serverId);
    })
);
