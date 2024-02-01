import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function getUser() {
    const supabase = createClient();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
