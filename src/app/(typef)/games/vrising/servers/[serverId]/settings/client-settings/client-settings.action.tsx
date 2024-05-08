"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import {
    updatePalworldSettings,
    userSettingsSchema,
} from "@/(global)/lib/palworld/service";
import { configs } from "@/(global)/configs/servers/palworld";
import {
    getServerStatus,
    restartServer,
} from "@/(global)/lib/cloud-provider/server";
import { getServerSettings } from "@/(global)/lib/palworld/rest-api";
import { z } from "zod";
import { getGameConfigs } from "@/(global)/lib/database/db-configs";

const getClientSettingsSchema = z.object({});

export const getClientSettingsAction = action(
    getClientSettingsSchema,
    async ({}) => {
        // change to use database
        const res = await getGameConfigs(1);
        return res;
    }
);

const setClientSettingsSchema = z.object({ test: z.boolean() });

export const setClientSettingsAction = action(
    setClientSettingsSchema,
    async (clientSettings) => {
        // await updatePalworldSettings(clientSettings);

        const server = await getServerStatus(configs.game, configs.serverId);

        if (server.status === "Running") {
            await restartServer(configs.game, configs.serverId);
        }
    }
);
