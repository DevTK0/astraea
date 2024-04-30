import { config } from "process";
import { SupabaseDBError } from "../exception/database";
import { Database } from "./actions";

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
