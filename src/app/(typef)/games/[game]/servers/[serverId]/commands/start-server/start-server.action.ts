"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { startServer } from "@/(global)/lib/cloud-provider/server";
import { instanceTypes } from "@/(global)/lib/cloud-provider/aws/ec2";
import { getServerConfigs } from "@/(global)/services/database/db-configs";
import { ServerError } from "@/(global)/lib/exception/next-safe-action";

const startServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

const admin = true;

export const startServerAction = action(
    startServerSchema,
    async ({ game, serverId }) => {
        const date = new Date();

        if (!validateHours(date)) {
            throw new ServerError(
                "Server is only available from Friday 6:00 PM to Sunday 2:00 AM"
            );
        }

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

const validateHours = (date: Date) => {
    // admins can start the server at any time
    if (admin) return true;

    return (
        (date.getUTCDay() === 5 && date.getUTCHours() >= 10) ||
        date.getUTCDay() === 6 ||
        (date.getUTCDay() === 0 && date.getUTCHours() < 18)
    );
};
