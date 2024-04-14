"use server";
import { gamelist } from "@/meta/gamedata";
import {
    checkIfServerIsRunning,
    stopServer,
} from "@/lib/cloud-provider/aws/ec2";
import {
    ServerError,
    withErrorHandling,
} from "@/lib/error-handling/next-safe-action";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

const stopServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const stopServerAction = withErrorHandling(
    action(stopServerSchema, async ({ game, serverId }) => {
        const instance = await checkIfServerIsRunning(game, serverId);

        if (!instance) throw new ServerError("Server is not running");

        stopServer(game, serverId);
    })
);
