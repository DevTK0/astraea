import "server-only";

import { SupabaseDBError } from "@/(global)/lib/exception/database";
import { Database } from "@/(global)/lib/database/server";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";

export async function getSiteConfigs() {
    const db = Database();
    const { data: configs, error } = await db.from("site_configs").select("*");

    if (error) throw new SupabaseDBError(error);

    // convert from array to object
    const configObject: Record<string, string | null> = {};
    configs.forEach((row) => {
        configObject[row.config] = row.value;
    });

    return configObject;
}

export async function getInstanceCosts() {
    const db = Database();
    const { data: configs, error } = await db
        .from("site_configs")
        .select(`config, value`)
        .eq("config", "instance_costs")
        .single();
    if (error) throw new SupabaseDBError(error);
    if (!configs.value) throw new ServerError("Instance costs not found");

    return JSON.parse(configs.value);
}
