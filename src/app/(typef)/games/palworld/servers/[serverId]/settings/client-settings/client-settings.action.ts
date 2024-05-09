"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import {
    updatePalworldSettings,
    userSettingsSchema,
} from "@/(global)/services/palworld/service";
import { configs } from "@/(global)/configs/servers/palworld";
import {
    getServerStatus,
    restartServer,
} from "@/(global)/lib/cloud-provider/server";
import { getServerSettings } from "@/(global)/services/palworld/rest-api";
import { z } from "zod";
import { getGameConfigs } from "@/(global)/services/database/db-configs";

const getClientSettingsSchema = z.object({});

export const getClientSettingsAction = action(
    getClientSettingsSchema,
    async ({}) => {
        const serverId = 1;
        // change to use database
        const res = await getGameConfigs(serverId);
        return res;
    }
);

const setClientSettingsSchema = userSettingsSchema;

export const setClientSettingsAction = action(
    setClientSettingsSchema,
    async (clientSettings) => {
        const configs = { game: "palworld", serverId: 1 };
        await updatePalworldSettings(clientSettings);

        const server = await getServerStatus(configs.game, configs.serverId);

        if (server.status === "Running") {
            await restartServer(configs.game, configs.serverId);
        }
    }
);
