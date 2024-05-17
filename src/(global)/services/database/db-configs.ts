import "server-only";

import { SupabaseDBError } from "@/(global)/lib/exception/database";
import { Database } from "@/(global)/lib/database/server";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";

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

export async function getWeekdayAccess(serverId: number) {
    const db = Database();
    const { data: wdAccess, error } = await db
        .from("server_configs")
        .select(
            `
            config,
            value
            `
        )
        .eq("server_id", serverId)
        .eq("config", "weekday_access")
        .single();

    if (error) throw new SupabaseDBError(error);

    if (!wdAccess.value) return false;

    return wdAccess.value === "true";
}

export async function setWeekdayAccess(serverId: number, value: boolean) {
    const db = Database();
    const { error } = await db
        .from("server_configs")
        .update({
            value: value.toString(),
        })
        .eq("server_id", serverId)
        .eq("config", "weekday_access");

    if (error) throw new SupabaseDBError(error);
}

export async function getInstanceType(serverId: number) {
    const db = Database();
    const { data: instanceType, error } = await db
        .from("server_configs")
        .select(
            `
            config,
            value
            `
        )
        .eq("server_id", serverId)
        .eq("config", "instance_type")
        .single();

    if (error) throw new SupabaseDBError(error);
    if (!instanceType.value) throw new ServerError("Instance type not found");

    return instanceType.value;
}

export async function setInstanceType(serverId: number, instanceType: string) {
    const db = Database();
    const { error } = await db
        .from("server_configs")
        .update({
            value: instanceType,
        })
        .eq("server_id", serverId)
        .eq("config", "instance_type");

    if (error) throw new SupabaseDBError(error);
}
