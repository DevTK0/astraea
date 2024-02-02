import { createClient } from "../clients/actions";
import { cookies } from "next/headers";
import { Database } from "../database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export function execute_query(query: (...args: any[]) => Promise<any>) {
    return async function execute(...args: any[]) {
        const cookieStore = cookies();
        const client = createClient(cookieStore);

        const { data, error, status, statusText } = await query(
            client,
            ...args
        );

        if (status < 200 || status >= 300) {
            console.log(status, statusText);
            throw new Error(statusText);
        }

        if (error) {
            console.log(error);
            throw error;
        }

        return data;
    };
}
