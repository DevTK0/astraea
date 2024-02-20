"use server";

import { Database } from "@/lib/database/actions";
// import { Database2 } from "@/lib/database/database";
import { action } from "@/lib/server-actions/next-safe-action";
import { cookies } from "next/headers";
import { z } from "zod";

const usersSchema = z.object({});

// export const users = action(usersSchema, async () => {
//     const db = Database2();
//     return db
//         .selectFrom("server_communities")
//         .leftJoin("users", "server_communities.user_id", "users.user_id")
//         .select(["server_id", "users.user_id", "ip_address"])
//         .execute();
// });

export const users2 = action(usersSchema, async () => {
    const supabase = Database();
    const { data, error } = await supabase
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
        .eq("server_id", 1);

    return data;
});
