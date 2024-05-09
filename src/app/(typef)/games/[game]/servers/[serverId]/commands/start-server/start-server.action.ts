"use server";
import { gamelist } from "@/(global)/meta/gamedata";
import { action } from "@/(global)/lib/request/next-safe-action";
import { z } from "zod";
import { startServer } from "@/(global)/lib/cloud-provider/server";
import { instanceTypes } from "@/(global)/lib/cloud-provider/aws/ec2";
import { getServerConfigs } from "@/(global)/services/database/db-configs";

const startServerSchema = z.object({
    game: z.enum(gamelist),
    serverId: z.number(),
});

export const startServerAction = action(
    startServerSchema,
    async ({ game, serverId }) => {
        console.log(game, serverId);
        const configs = await getServerConfigs(serverId);

        console.log(configs);

        const { volume_size, instance_type } = z
            .object({
                volume_size: z.coerce.number(),
                instance_type: z.enum(instanceTypes),
            })
            .parse(configs);

        console.log(volume_size, instance_type);

        await startServer(game, serverId, {
            volumeSize: volume_size,
            instanceType: instance_type,
        });
    }
);
