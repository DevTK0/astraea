"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { ServerError } from "@/(global)/lib/error-handling/next-safe-action";
import { checkIfClientIsRunning } from "@/(global)/lib/palworld/rest-api";
import {
    getServerAddress,
    updatePalworld,
} from "@/(global)/lib/cloud-provider/server";

const updateClientSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const updateClientAction = action(
    updateClientSchema,
    async ({ game, serverId }) => {
        const serverAddress = await getServerAddress(game, serverId);

        const response = await checkIfClientIsRunning(serverAddress);

        if (response)
            throw new ServerError(
                "Client must be shutdown before performing updates."
            );

        await updatePalworld();
    }
);
