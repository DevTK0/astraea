"use server";

import { Database } from "@/lib/database/actions";
import { SupabaseDBError } from "@/lib/error-handling/database";
import { action } from "@/lib/server-actions/next-safe-action";
import { z } from "zod";

import { fetchWithErrorHandling, getURL } from "@/lib/http/fetch";
import { withErrorHandling } from "@/lib/error-handling/next-safe-action";
import { configureAllowedIPs } from "@/lib/cloud-provider/server";

// export const getIpAddressAction = async () =>
//     await fetchWithErrorHandling(`${getURL()}/users/ip`);

const whitelistIpSchema = z.object({
    ipAddress: z.string().ip({ version: "v4" }),
    userId: z.string().uuid(),
    serverId: z.number(),
});

export const whitelistIpAction = withErrorHandling(
    action(whitelistIpSchema, async ({ ipAddress, userId, serverId }) => {
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
    })
);
