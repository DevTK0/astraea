"use server";

import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/meta/gamedata";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import {
    announceMessage,
    getPlayerList,
    banPlayer,
    unbanPlayer,
    save,
} from "@/lib/palworld/rest-api";

const updateServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const updateServerAction = withErrorHandling(
    action(updateServerSchema, async ({ game, serverId }) => {
        // const res = await banPlayer(
        //     "52.77.219.87",
        //     "steam_76561198973252083",
        //     "test ban api"
        // );
        // const res = await getPlayerList("52.77.219.87");
        // get server address
        // shutdown server using api
        // run update script using aws server manager
    })
);
