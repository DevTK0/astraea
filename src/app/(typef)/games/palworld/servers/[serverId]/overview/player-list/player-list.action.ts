"use server";

import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import {
    checkIfClientIsRunning,
    getPlayerList,
    playerListSchema,
} from "@/(global)/services/palworld/rest-api";
import { getServerStatus } from "@/(global)/lib/cloud-provider/server";
import { configs } from "@/(global)/configs/servers/palworld";
import { gamelist } from "@/(global)/meta/gamedata";

const getPlayerListSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const getPlayerListAction = action(
    getPlayerListSchema,
    async ({ game, serverId }) => {
        const playerList: z.infer<typeof playerListSchema> = [];

        const server = await getServerStatus(game, serverId);

        if (server.status !== "Running") return playerList;

        const serverAddress = z.string().ip().parse(server.ipAddress);

        const isUp = await checkIfClientIsRunning(serverAddress);

        if (isUp) {
            return await getPlayerList(serverAddress);
        } else {
            return playerList;
        }
    }
);
