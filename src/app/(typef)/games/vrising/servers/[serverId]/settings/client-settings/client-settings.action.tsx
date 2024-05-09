"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import {
    getServerStatus,
    restartServer,
} from "@/(global)/lib/cloud-provider/server";
import { z } from "zod";
import { getGameConfigs } from "@/(global)/services/database/db-configs";
import { gamelist } from "@/(global)/meta/gamedata";

const getClientSettingsSchema = z.object({});

export const getClientSettingsAction = action(
    getClientSettingsSchema,
    async ({}) => {
        return await getGameConfigs(2);
    }
);

const setClientSettingsSchema = z.object({
    settings: z.object({
        RelicSpawnType: z.string(),
        ShowSiegeWeaponMapIcon: z.boolean(),
    }),
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const setClientSettingsAction = action(
    setClientSettingsSchema,
    async ({ settings, game, serverId }) => {
        // await updatePalworldSettings(settings);

        console.log(settings);

        // const server = await getServerStatus(game, serverId);

        // if (server.status === "Running") {
        //     await restartServer(game, serverId);
        // }
    }
);
