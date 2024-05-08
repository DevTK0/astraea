import { z } from "zod";

import { gamelist } from "@/(global)/meta/gamedata";
import { announceMessage } from "@/(global)/lib/palworld/rest-api";
import { getServerAddress } from "@/(global)/lib/cloud-provider/server";

type input = z.infer<typeof broadcastSchema>;

export const broadcastSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
    message: z.string(),
});

export async function broadcast({ game, serverId, message }: input) {
    const serverAddress = await getServerAddress(game, serverId);

    await announceMessage(serverAddress, message);
}
