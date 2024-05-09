import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { announceMessage } from "@/(global)/services/palworld/rest-api";
import { getServerAddress } from "@/(global)/lib/cloud-provider/server";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";

type input = z.infer<typeof broadcastSchema>;

export const broadcastSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
    message: z.string(),
});

export async function broadcast({ game, serverId, message }: input) {
    const serverAddress = await getServerAddress(game, serverId);

    try {
        await announceMessage(serverAddress, message);
    } catch (error) {
        console.error(error);
        throw new ServerError("Client is not running.");
    }
}
