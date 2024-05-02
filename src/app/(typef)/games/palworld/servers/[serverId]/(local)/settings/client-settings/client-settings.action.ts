"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import {
    getClientSettings,
    getClientSettingsSchema,
    isServerRunning,
    isServerRunningSchema,
    setClientSettings,
    setClientSettingsSchema,
} from "./client-settings.service";

export const isServerRunningAction = action(
    isServerRunningSchema,
    async (args) => {
        return await isServerRunning(args);
    }
);

export const getClientSettingsAction = action(
    getClientSettingsSchema,
    async (args) => {
        return await getClientSettings(args);
    }
);

export const setClientSettingsAction = action(
    setClientSettingsSchema,
    async (args) => {
        return await setClientSettings(args);
    }
);
