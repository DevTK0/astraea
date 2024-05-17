import { Database } from "@/(global)/lib/database/server";
import { SupabaseDBError } from "@/(global)/lib/exception/database";

export async function getCoins(userId: string) {
    const db = Database();
    const { data: user, error } = await db
        .from("users")
        .select(
            `
        auth_uid,
        coins
        `
        )
        .eq("auth_uid", userId)
        .single();

    if (error) throw new SupabaseDBError(error);

    return user.coins;
}

export async function setCoins(userId: string, amount: number) {
    const db = Database();
    const { error } = await db
        .from("users")
        .update({ coins: amount })
        .eq("auth_uid", userId);

    if (error) throw new SupabaseDBError(error);
}
