import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export async function getSavFilename(
    client: SupabaseClient<Database>,
    user_id: string
) {
    return client
        .from("server_communities")
        .select("sav_filename")
        .eq("user_id", user_id)
        .single();
}
