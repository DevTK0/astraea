import { createClient } from "@/lib/supabase/actions";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import {
    EC2Client,
    AuthorizeSecurityGroupIngressCommand,
    RevokeSecurityGroupIngressCommand,
    DescribeSecurityGroupRulesCommand,
} from "@aws-sdk/client-ec2";

export async function POST(req: NextRequest) {
    let ip = req.ip || req.headers.get("X-Forwarded-For");

    if (ip === "::1") ip = "127.0.0.1";

    // store ip in supabase
    const cookieStore = cookies();
    const client = createClient(cookieStore);

    const {
        data: { user },
    } = await client.auth.getUser();

    if (user) {
        await client
            .from("server_communities")
            .upsert({ server_id: 1, user_id: user.id });

        await client
            .from("users")
            .update({ ip_address: ip })
            .eq("user_id", user.id);

        const { data, error } = await client.from("server_communities").select(`
            server_id,
            user_id,
            users (
                user_id,
                ip_address
            )
        `);

        const ip_list = [];

        if (!error) {
            for (const row of data) {
                if (row.users?.ip_address !== "") {
                    const ipRange = {
                        CidrIp: row.users?.ip_address + "/32",
                        Description: "IP Whitelist",
                    };
                    ip_list.push(ipRange);
                }
            }

            console.log(ip_list);

            if (ip_list.length > 0) {
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

                console.log(toRemove);

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

                    console.log(removed);
                }

                const newIpList = await aws.send(
                    new AuthorizeSecurityGroupIngressCommand({
                        GroupId: "sg-07e29307eba3464d4",
                        IpPermissions: [
                            {
                                FromPort: 8211,
                                ToPort: 8211,
                                IpProtocol: "udp",
                                IpRanges: ip_list,
                            },
                        ],
                    })
                );
                console.log(newIpList);
            }
        }

        console.log(data, error);
    }

    return Response.json(ip);
}
