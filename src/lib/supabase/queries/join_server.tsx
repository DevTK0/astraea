import { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { createClient } from "../clients/actions";
import { cookies } from "next/headers";

export async function joinServer(
    client: SupabaseClient<Database>,
    serverId: number,
    userId: string
) {
    return client
        .from("server_communities")
        .upsert({ server_id: serverId, user_id: userId });
}
