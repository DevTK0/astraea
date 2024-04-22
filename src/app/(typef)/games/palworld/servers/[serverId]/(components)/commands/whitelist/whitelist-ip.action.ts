"use server";

import { configs } from "@/configs/servers/palworld";
import { Database } from "@/lib/database/actions";
import { SupabaseDBError } from "@/lib/error-handling/database";
import { action } from "@/lib/server-actions/next-safe-action";
import {
    AuthorizeSecurityGroupIngressCommand,
    DescribeSecurityGroupRulesCommand,
    EC2Client,
    RevokeSecurityGroupIngressCommand,
} from "@aws-sdk/client-ec2";
import { z } from "zod";

const whitelistIpSchema = z.object({
    ipAddress: z.string().ip({ version: "v4" }),
    userId: z.number(),
    serverId: z.number(),
});

export const whitelistIp = action(
    whitelistIpSchema,
    async ({ ipAddress, userId, serverId }) => {
        const db = Database();

        const updateIp = await db
            .from("users")
            .update({ ip_address: ipAddress })
            .eq("user_id", userId);

        if (updateIp.error) throw new SupabaseDBError(updateIp.error);

        const getIpList = await db
            .from("users")
            .select(
                `
                user_id,
                ip_address,
                server_communities (
                    server_id        
                )
                `
            )
            .eq("server_communities.server_id", serverId);

        if (getIpList.error) throw new SupabaseDBError(getIpList.error);

        const ipList: string[] = [];
        const ipRanges = [];

        // extract ip address from each user that has joined the seerver
        for (const row of getIpList.data) {
            const ip = z
                .string()
                .ip({ version: "v4" })
                .optional()
                .parse(row.ip_address);

            // remove duplicates
            if (ip && !ipList.includes(ip)) {
                const ipRange = {
                    CidrIp: ip + "/32",
                    Description: "IP Whitelist",
                };
                ipList.push(ip);
                ipRanges.push(ipRange);
            }
        }

        z.string().array().nonempty().parse(ipList);

        // add ips to security group
        const ec2 = new EC2Client();

        const securityGroupRules = await ec2.send(
            new DescribeSecurityGroupRulesCommand({
                Filters: [
                    {
                        Name: "group-id",
                        Values: [configs.palworld_sg],
                    },
                ],
            })
        );

        const toRemove = securityGroupRules.SecurityGroupRules?.filter(
            (rule) => {
                return rule.IpProtocol === "udp" && rule.FromPort === 8211;
            }
        );

        // Remove previous Ips if any
        if (toRemove && toRemove.length > 0) {
            const removed = await ec2.send(
                new RevokeSecurityGroupIngressCommand({
                    GroupId: configs.palworld_sg,
                    SecurityGroupRuleIds: toRemove.map((rule) =>
                        rule.SecurityGroupRuleId ? rule.SecurityGroupRuleId : ""
                    ),
                })
            );
        }

        const newIpList = await ec2.send(
            new AuthorizeSecurityGroupIngressCommand({
                GroupId: configs.palworld_sg,
                IpPermissions: [
                    {
                        FromPort: 8211,
                        ToPort: 8211,
                        IpProtocol: "udp",
                        IpRanges: ipRanges,
                    },
                ],
            })
        );
        return { message: `${ipAddress} added to server whitelist.` };
    }
);
