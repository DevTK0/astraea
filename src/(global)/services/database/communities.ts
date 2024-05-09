import { Database } from "@/(global)/lib/database/server";
import { SupabaseDBError } from "@/(global)/lib/exception/database";

export async function joinCommunity(serverId: number, userId: string) {
    const db = Database();

    const { error } = await db
        .from("server_communities")
        .upsert({ auth_uid: userId, server_id: serverId });

    if (error) throw new SupabaseDBError(error);
}
