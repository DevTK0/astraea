import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database as Schemas } from "./types";

/**
 * Can only be used in server-side after cookies have been initialised.
 * @returns
 */
export function Database() {
    const cookieStore = cookies();
    return createServerClient<Schemas>(
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
