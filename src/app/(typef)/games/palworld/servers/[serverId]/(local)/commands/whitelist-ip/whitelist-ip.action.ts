"use server";

import { Database } from "@/(global)/lib/database/actions";
import { SupabaseDBError } from "@/(global)/lib/exception/database";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { configureAllowedIPs } from "@/(global)/lib/cloud-provider/server";
import { getUser } from "@/(global)/lib/auth/actions";
import { getServerConfigs } from "@/(global)/lib/database/db-configs";

const whitelistIpSchema = z.object({
    ipAddress: z.string().ip({ version: "v4" }),
    serverId: z.number(),
});

export const whitelistIpAction = action(
    whitelistIpSchema,
    async ({ ipAddress, serverId }) => {
        const user = await getUser();
        const userId = z.string().uuid().parse(user?.id);
        const db = Database();

        const updateIp = await db
            .from("users")
            .update({ ip_address: ipAddress })
            .eq("auth_uid", userId);

        if (updateIp.error) throw new SupabaseDBError(updateIp.error);

        const getIpList = await db
            .from("users")
            .select(
                `
                auth_uid,
                ip_address,
                server_communities (
                    server_id        
                )
                `
            )
            .eq("server_communities.server_id", serverId);

        if (getIpList.error) throw new SupabaseDBError(getIpList.error);

        const ipAddresses: string[] = [];

        getIpList.data.forEach((row) => {
            ipAddresses.push(row.ip_address ?? "");
        });

        const configs = z
            .object({
                security_group: z.string(),
            })
            .parse(await getServerConfigs(serverId));

        await configureAllowedIPs(ipAddresses, configs.security_group);

        return { message: `${ipAddress} added to server whitelist.` };
    }
);
