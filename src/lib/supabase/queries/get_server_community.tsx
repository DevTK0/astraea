import { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { createClient } from "@/lib/supabase/clients/client";

export async function getServerCommunity(
    client: SupabaseClient<Database>,
    serverId: number
) {
    const test = client
        .from("server_communities")
        .select(
            `
            server_id,
            user_id,
            users (
                user_id,
                ip_address
            )
            `
        )
        .eq("server_id", serverId);

    type test2 = QueryData<typeof test>;

    return test;
}

const query = createClient()
    .from("server_communities")
    .select(
        `
    server_id,
    user_id,
    users (
        user_id,
        ip_address
    )
    `
    );

export type ServerCommunity = QueryData<typeof query>;
