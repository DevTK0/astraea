"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { Database } from "@/(global)/lib/database/actions";
import { SupabaseDBError } from "@/(global)/lib/error-handling/database";
import { withErrorHandling } from "@/(global)/lib/error-handling/next-safe-action";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { startServer } from "@/(global)/lib/cloud-provider/server";

const startServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const startServerAction = action(
    startServerSchema,
    async ({ game, serverId }) => {
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
    }
);
