"use server";
import { Database } from "@/lib/database/actions";
import { DBError } from "@/lib/error-handling/database";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

const startSchema = z.object({
    serverId: z.number(),
});

export const startServer = action(startSchema, async ({ serverId }) => {
    const db = Database();
    const { data, error } = await db
        .from("server_configs")
        .select(
            `
            volume_size,
            instance_type,
            server_id
            `
        )
        .eq("server_id", serverId);

    if (error) throw new DBError(error);

    // start server
});
