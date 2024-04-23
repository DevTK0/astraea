"use server";

import { configs } from "@/configs/servers/palworld";
import { Database } from "@/lib/database/server";
import { SupabaseDBError } from "@/lib/error-handling/database";
import { action } from "@/lib/server-actions/next-safe-action";
import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import { z } from "zod";

const getSavesSchema = z.object({
    serverId: z.number(),
    userId: z.number(),
});

export const getSaves = action(getSavesSchema, async ({ userId, serverId }) => {
    const db = Database();
    const { data, error } = await db
        .from("server_communities")
        .select(
            `
            server_id,
            save_id,
            users!inner (
                user_id
            )
            `
        )
        .eq("users.user_id", userId)
        .eq("server_id", serverId)
        .single();

    if (error) throw new SupabaseDBError(error);

    const saveId = z.string().length(32).parse(data?.save_id);

    const s3 = new S3Client({ region: "ap-southeast-1" });
    const saves = await s3.send(
        new ListObjectsV2Command({
            Bucket: "astraea-typef",
            Prefix: `1/backups/${saveId}`,
        })
    );

    const saveFiles: Set<string> = new Set<string>();

    saves.Contents?.forEach((content) => {
        const saveFile = content.Key?.split("/")[3];
        if (saveFile) saveFiles.add(saveFile);
    });

    return {
        saveId: saveId,
        saves: Array.from(saveFiles),
    };
});

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

        const ec2 = new EC2Client();
        const ssm = new SSMClient();

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
