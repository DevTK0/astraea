"use server";

import { configs } from "@/(global)/configs/servers/palworld";
import { getUser } from "@/(global)/lib/auth/actions";
import { Database } from "@/(global)/lib/database/server";
import { SupabaseDBError } from "@/(global)/lib/exception/database";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { action } from "@/(global)/lib/request/next-safe-action";
import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import { z } from "zod";

const getSavesSchema = z.object({
    serverId: z.number(),
    // userId: z.string(),
});

export const getSavesAction = action(getSavesSchema, async ({ serverId }) => {
    const user = await getUser();
    const userId = user.id;

    const db = Database();
    const { data, error } = await db
        .from("server_communities")
        .select(
            `
            server_id,
            save_id,
            users!inner (
                auth_uid
            )
            `
        )
        .eq("users.auth_uid", userId)
        .eq("server_id", serverId)
        .single();

    if (error) throw new SupabaseDBError(error);

    const saveId = z.string().optional().parse(data?.save_id);

    if (!saveId) {
        return {
            saveId: "",
            saveFiles: [],
        };
    }

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
        saveFiles: Array.from(saveFiles),
    };
});

const restoreSaveSchema = z.object({
    serverId: z.number(),
    saveFile: z.string().min(1),
    saveId: z.string().min(1),
});

export const restoreSaveAction = action(
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
