"use server";

import { getServerStatus } from "@/(global)/lib/cloud-provider/server";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { withErrorHandling } from "@/(global)/lib/error-handling/next-safe-action";

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
