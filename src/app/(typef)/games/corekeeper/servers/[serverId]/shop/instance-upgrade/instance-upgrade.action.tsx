"use server";
import { instanceTypes } from "@/(global)/lib/cloud-provider/aws/ec2";
import { action } from "@/(global)/lib/request/next-safe-action";
import {
    getInstanceType,
    setInstanceType,
} from "@/(global)/services/database/db-configs";
import { z } from "zod";
import { getInstanceCosts } from "@/(global)/services/database/site-configs";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";
import { expireInstanceUpgrade } from "@/(global)/services/auto-stop/service";
import { getUser } from "@/(global)/lib/auth/actions";
import { getCoins, setCoins } from "@/(global)/services/database/users";
import { revalidatePath } from "next/cache";

const instanceUpgradeSchema = z.object({
    serverId: z.number(),
    instanceType: z.enum(instanceTypes),
});

export const instanceUpgradeAction = action(
    instanceUpgradeSchema,
    async ({ serverId, instanceType }) => {
        const user = await getUser();
        const currentInstanceType = await getInstanceType(serverId);
        const costs = await getInstanceCosts();
        const upgradeCost = costs[instanceType] - costs[currentInstanceType];

        if (upgradeCost < 0) {
            throw new ServerError("Cannot downgrade instance type.");
        }

        const userBalance = await getCoins(user.id);

        if (userBalance < upgradeCost) {
            throw new ServerError("Insufficient coins.");
        }

        await setCoins(user.id, userBalance - upgradeCost);

        await setInstanceType(serverId, instanceType);
        await expireInstanceUpgrade(serverId, 2, user.id);

        revalidatePath("/");
    }
);
