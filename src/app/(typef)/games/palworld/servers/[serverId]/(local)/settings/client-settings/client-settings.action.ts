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
    async ({}) => {
        return await isServerRunning({});
    }
);

export const getClientSettingsAction = action(
    getClientSettingsSchema,
    async ({ ipAddress }) => {
        return await getClientSettings({ ipAddress: ipAddress });
    }
);

export const setClientSettingsAction = action(
    setClientSettingsSchema,
    async (clientSettings) => {
        return await setClientSettings(clientSettings);
    }
);
