import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../database.types";

export function createClient(cookieStore: ReturnType<typeof cookies>) {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
}

export async function getSession() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
