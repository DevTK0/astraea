import "server-only";

import { Database as Schemas } from "./types";
import { createClient } from "@supabase/supabase-js";

/**
 * Only for backend jobs
 * @returns
 */
export function ServiceRole() {
    return createClient<Schemas>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}
