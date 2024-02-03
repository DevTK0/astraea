import { createClient } from "@/lib/supabase/clients/actions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
    EC2Client,
    AuthorizeSecurityGroupIngressCommand,
    RevokeSecurityGroupIngressCommand,
    DescribeSecurityGroupRulesCommand,
} from "@aws-sdk/client-ec2";

import { execute_query } from "@/lib/supabase/queries/execute_query";
import { joinServer } from "@/lib/supabase/queries/join_server";
import { updateIPAddress } from "@/lib/supabase/queries/update_ip_address";
import {
    ServerCommunity,
    getServerCommunity,
} from "@/lib/supabase/queries/get_server_community";

export async function POST(req: NextRequest) {
    let ip = req.ip || req.headers.get("X-Forwarded-For");

    // For localhost testing
    if (ip === "::1") ip = "127.0.0.1";

    const cookieStore = cookies();
    const client = createClient(cookieStore);

    const {
        data: { user },
    } = await client.auth.getUser();

    if (user) {
        try {
            await execute_query(joinServer)(1, user.id);
            await execute_query(updateIPAddress)(ip, user.id);

            const data: ServerCommunity = await execute_query(
                getServerCommunity
            )(1);
            const ip_list = new Set<{ CidrIp: string; Description: string }>();

            // extract ip address from each user that has joined the seerver
            for (const row of data) {
                if (row.users?.ip_address !== "") {
                    const ipRange = {
                        CidrIp: row.users?.ip_address + "/32",
                        Description: "IP Whitelist",
                    };
                    ip_list.add(ipRange);
                }
            }

            // add ips to security group
            if (ip_list.size > 0) {
                const aws = new EC2Client({ region: "ap-southeast-1" });

                const securityGroupRules = await aws.send(
                    new DescribeSecurityGroupRulesCommand({
                        Filters: [
                            {
                                Name: "group-id",
                                Values: ["sg-07e29307eba3464d4"],
                            },
                        ],
                    })
                );

                const toRemove = securityGroupRules.SecurityGroupRules?.filter(
                    (rule) => {
                        return (
                            rule.IpProtocol === "udp" && rule.FromPort === 8211
                        );
                    }
                );

                if (toRemove && toRemove.length > 0) {
                    const removed = await aws.send(
                        new RevokeSecurityGroupIngressCommand({
                            GroupId: "sg-07e29307eba3464d4",
                            SecurityGroupRuleIds: toRemove.map((rule) =>
                                rule.SecurityGroupRuleId
                                    ? rule.SecurityGroupRuleId
                                    : ""
                            ),
                        })
                    );
                }

                const newIpList = await aws.send(
                    new AuthorizeSecurityGroupIngressCommand({
                        GroupId: "sg-07e29307eba3464d4",
                        IpPermissions: [
                            {
                                FromPort: 8211,
                                ToPort: 8211,
                                IpProtocol: "udp",
                                IpRanges: Array.from(ip_list),
                            },
                        ],
                    })
                );
            }
        } catch (error) {
            if (typeof error === "string") {
                console.log(error);
                return new Response(JSON.stringify({ message: error }), {
                    status: 500,
                });
            } else if (error instanceof Error) {
                console.log(error.message);
                return new Response(
                    JSON.stringify({ message: error.message }),
                    {
                        status: 500,
                    }
                );
            }
        }
    }

    return new NextResponse(
        JSON.stringify({ message: `${ip} added to server whitelist.` }),
        {
            status: 200,
        }
    );
}
