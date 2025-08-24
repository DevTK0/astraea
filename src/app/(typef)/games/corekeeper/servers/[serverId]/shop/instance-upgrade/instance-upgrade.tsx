import { Label } from "@/(global)/components/ui/label";
import { ClientComponent } from "./instance-upgrade.client";
import { instanceTypes } from "@/(global)/lib/cloud-provider/aws/ec2";
import { z } from "zod";
import { getInstanceType } from "@/(global)/services/database/db-configs";
import { getInstanceCosts } from "@/(global)/services/database/site-configs";

export async function InstanceUpgrade({ serverId }: { serverId: number }) {
    const currentInstance = await getInstanceType(serverId);
    const instanceType = z.enum(instanceTypes).parse(currentInstance);
    const instanceCosts = await getInstanceCosts();

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Instance Upgrade (2 hrs)</Label>
                <div className="text-sm text-muted-foreground">
                    Upgrades the server instance to a higher tier for 2 hours.
                </div>
            </div>

            {currentInstance ? (
                <ClientComponent
                    currentInstance={instanceType}
                    instanceCosts={instanceCosts}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
