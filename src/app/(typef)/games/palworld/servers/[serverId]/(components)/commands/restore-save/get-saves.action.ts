"use server";

import { Database } from "@/lib/database/actions";
import { SupabaseDBError } from "@/lib/error-handling/database";
import { action } from "@/lib/server-actions/next-safe-action";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

const getSavesSchema = z.object({
    serverId: z.number(),
    userId: z.number(),
});

export const getSaves = action(getSavesSchema, async ({ userId, serverId }) => {
    const db = Database();
    const { data, error } = await db
        .from("server_communities")
        .select(
            `
            server_id,
            save_id,
            users!inner (
                user_id
            )
            `
        )
        .eq("users.user_id", userId)
        .eq("server_id", serverId)
        .single();

    if (error) throw new SupabaseDBError(error);

    const saveId = z.string().length(32).parse(data?.save_id);

    const s3 = new S3Client({ region: "ap-southeast-1" });
    const saves = await s3.send(
        new ListObjectsV2Command({
            Bucket: "astraea-typef",
            Prefix: `1/backups/${saveId}`,
        })
    );

    const saveFiles: Set<string> = new Set<string>();

    saves.Contents?.forEach((content) => {
        const saveFile = content.Key?.split("/")[3];
        if (saveFile) saveFiles.add(saveFile);
    });

    return {
        saveId: saveId,
        saves: Array.from(saveFiles),
    };
});
