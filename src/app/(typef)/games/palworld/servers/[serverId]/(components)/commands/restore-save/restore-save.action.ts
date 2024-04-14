"use server";

import { aws } from "@/configs/aws";
import { configs } from "@/configs/games/palworld";
import { action } from "@/lib/server-actions/next-safe-action";
import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import { z } from "zod";

const restoreSaveSchema = z.object({
    serverId: z.number(),
    saveFile: z.string().min(1),
    saveId: z.string().min(1),
});

export const restoreSave = action(
    restoreSaveSchema,
    async ({ serverId, saveFile, saveId }) => {
        const s3FilePath = `s3://astraea-typef/${serverId}/backups`;
        const saveFilePath = configs.saveFilePath;

        const ec2 = new EC2Client({ region: aws.region });
        const ssm = new SSMClient({ region: aws.region });

        const response = await ec2.send(
            new DescribeInstancesCommand({
                Filters: [
                    {
                        Name: "tag:Game",
                        Values: ["Palworld"],
                    },
                    {
                        Name: "tag:InstanceType",
                        Values: ["GAME_SERVER"],
                    },
                    {
                        Name: "instance-state-name",
                        Values: ["pending", "running"],
                    },
                ],
            })
        );

        const reservations = z
            .any()
            .array()
            .length(1)
            .parse(response.Reservations);

        const instances = z
            .any()
            .array()
            .length(1)
            .parse(reservations[0].Instances);

        const instance = instances[0];
        const instanceId = z.string().parse(instance.InstanceId);

        // Use SSM to run the command to restore the save file
        const res = await ssm.send(
            new SendCommandCommand({
                InstanceIds: [instanceId],
                DocumentName: "AWS-RunShellScript",
                Parameters: {
                    commands: [
                        `aws s3 cp ${s3FilePath}/${saveId}/${saveFile} /tmp/${saveFile}`,
                        `tar -xvf /tmp/${saveFile} -C ${saveFilePath}`,
                        `rm /tmp/${saveFile}`,
                    ],
                },
            })
        );

        return {
            message: `Restored ${saveFile}`,
        };
    }
);
