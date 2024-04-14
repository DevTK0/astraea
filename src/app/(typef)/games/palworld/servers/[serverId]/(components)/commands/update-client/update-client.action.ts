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

const updateClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const updateClientAction = withErrorHandling(
    action(updateClientSchema, async ({ game, serverId }) => {
        // const res = await banPlayer(
        //     "52.77.219.87",
        //     "steam_76561198973252083",
        //     "test ban api"
        // );
        const res = await getPlayerList("52.77.219.87");
        console.log(res);
        // get server address
        // shutdown server using api
        // run update script using aws server manager
    })
);
