"use server";

import { Database } from "@/(global)/lib/database/actions";
import { SupabaseDBError } from "@/(global)/lib/error-handling/database";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";

import { configureAllowedIPs } from "@/(global)/lib/cloud-provider/server";
import { getUser } from "@/(global)/lib/auth/actions";

export const whitelistIpSchema = z.object({
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

        await configureAllowedIPs(ipAddresses);

        return { message: `${ipAddress} added to server whitelist.` };
    }
);
