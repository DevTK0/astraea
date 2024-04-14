"use server";
import { gamelist } from "@/meta/gamedata";
import {
    checkIfServerIsRunning,
    getInstanceState,
    startServer,
    waitForServerIp,
} from "@/lib/cloud-provider/aws/ec2";
import { Database } from "@/lib/database/actions";
import { SupabaseDBError } from "@/lib/error-handling/database";
import {
    ServerError,
    withErrorHandling,
} from "@/lib/error-handling/next-safe-action";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

const startServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const startServerAction = withErrorHandling(
    action(startServerSchema, async ({ game, serverId }) => {
        const instance = await getInstanceState(game, serverId);

        if (instance.status === "Running")
            throw new ServerError("Server is already running");
        if (instance.status === "Starting")
            throw new ServerError("Server is already starting");
        if (instance.status === "Stopping")
            throw new ServerError("Server is stopping");
        if (instance.status === "Archived")
            throw new ServerError("Server is archived");

        const db = Database();
        const { data: configs, error } = await db
            .from("server_configs")
            .select(
                `
                volume_size,
                instance_type,
                server_id
                `
            )
            .eq("server_id", serverId)
            .single();

        if (error) throw new SupabaseDBError(error);

        z.object({
            volume_size: z.number(),
            instance_type: z.string(),
        }).parse(configs);

        await startServer(game, serverId, {
            volumeSize: configs.volume_size,
            instanceType: configs.instance_type,
        });

        return await waitForServerIp(game, serverId);
    })
);
