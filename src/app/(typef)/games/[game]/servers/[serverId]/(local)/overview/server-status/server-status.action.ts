"use server";

import { getServerStatus } from "@/(global)/lib/cloud-provider/server";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";

const getServerStatusSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const getServerStatusAction = action(
    getServerStatusSchema,
    async ({ game, serverId }) => {
        return await getServerStatus(game, serverId);
    }
);
