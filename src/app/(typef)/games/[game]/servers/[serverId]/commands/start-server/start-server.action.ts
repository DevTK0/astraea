"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { startServer } from "@/(global)/lib/cloud-provider/server";
import { instanceTypes } from "@/(global)/lib/cloud-provider/aws/ec2";
import {
    getServerConfigs,
    getWeekdayAccess,
} from "@/(global)/services/database/db-configs";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";
import { isWeekend } from "@/(global)/lib/date/utils";

const startServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

// TODO: replace this with a proper admin check
const admin = true;

export const startServerAction = action(
    startServerSchema,
    async ({ game, serverId }) => {
        await validate(serverId);

        const configs = await getServerConfigs(serverId);

        const { volume_size, instance_type } = z
            .object({
                volume_size: z.coerce.number(),
                instance_type: z.enum(instanceTypes),
            })
            .parse(configs);

        await startServer(game, serverId, {
            volumeSize: volume_size,
            instanceType: instance_type,
        });
    }
);

async function validate(serverId: number) {
    if (admin) return true;
    if (isWeekend()) return true;

    const weekdayAccess = await getWeekdayAccess(serverId);

    if (weekdayAccess) return true;

    throw new ServerError(
        "Free Access is only available from Friday 6:00 PM to Monday 2:00 AM"
    );
}
