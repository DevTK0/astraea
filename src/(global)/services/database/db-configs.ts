import { SupabaseDBError } from "../../lib/exception/database";
import { ServerError } from "../../lib/exception/next-safe-action";
import { Database } from "../../lib/database/actions";

export async function getServerConfigs(serverId: number) {
    const db = Database();
    const { data: configs, error } = await db
        .from("server_configs")
        .select(
            `
            config,
            value
            `
        )
        .eq("server_id", serverId);

    if (error) throw new SupabaseDBError(error);

    // convert from array to object
    const configObject: Record<string, string | null> = {};
    configs.forEach((row) => {
        configObject[row.config] = row.value;
    });

    return configObject;
}

export async function getGameConfigs(serverId: number) {
    const db = Database();
    const { data: configs, error } = await db
        .from("server_configs")
        .select(
            `
            config,
            value
            `
        )
        .eq("server_id", serverId)
        .eq("config", "game_configs")
        .single();

    if (error) throw new SupabaseDBError(error);

    if (!configs.value) return {};

    return JSON.parse(configs.value);
}

export async function updateGameConfigs(
    serverId: number,
    configs: Record<string, any>
) {
    const db = Database();
    const { error } = await db
        .from("server_configs")
        .update({ value: JSON.stringify(configs) })
        .eq("server_id", serverId)
        .eq("config", "game_configs");

    if (error) throw new SupabaseDBError(error);
}
