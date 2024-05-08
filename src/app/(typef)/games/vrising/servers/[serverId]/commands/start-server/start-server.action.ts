"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { startServer } from "@/(global)/lib/cloud-provider/server";
import { instanceTypes } from "@/(global)/lib/cloud-provider/aws/ec2";
import { getServerConfigs } from "@/(global)/lib/database/db-configs";

const startServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const startServerAction = action(
    startServerSchema,
    async ({ game, serverId }) => {
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
