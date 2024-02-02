import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export async function updateIPAddress(
    client: SupabaseClient<Database>,
    ip: string,
    user_id: string
) {
    return client
        .from("users")
        .update({ ip_address: ip })
        .eq("user_id", user_id);
}
