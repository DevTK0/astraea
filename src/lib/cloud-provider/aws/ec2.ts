import { aws as configs } from "@/configs/aws";
import {
    DescribeImagesCommand,
    DescribeInstancesCommand,
    DescribeLaunchTemplatesCommand,
    DescribeSnapshotsCommand,
    DescribeVolumesCommand,
    EC2Client,
    RunInstancesCommand,
} from "@aws-sdk/client-ec2";
import { z } from "zod";
import { AWSError } from "@/lib/error-handling/aws";
import { ServerStatus } from "../server";

const ec2 = new EC2Client(configs.region);

/**
 * Flow:
 * Pending > Running > Shutting Down > Terminated > Lambda: Backup Volume into snapshot >
 * Lambda: Create AMI from snapshot > Lambda: Delete volume
 *
 * Server Status based on flow:
 * - Starting: Instance is pending
 * - Running: Instance is running
 * - Stopping: Instance is shutting-down / terminated / volume still exists
 * - Stopped: AMI exists (after volume is deleted)
 * - Archived: Archived snapshot exists
 * * Note: Why use multiple calls to determine state?
 * If we ease the filter rules, we can essentially use a single call to determine the state.
 * However, this will result in multiple results being returned, which complicates the evaluation logic.
 * How do you know if the server is running or stopped if 2 instances are returned?
 *
 * @param game
 * @param serverId
 * @returns
 */
export async function getInstanceState(
    game: string,
    serverId: number
): Promise<{
    status: ServerStatus;
    ipAddress?: string;
    instanceType?: string;
}> {
    const isStarting = await checkIfServerIsStarting(game, serverId);

    if (isStarting)
        return {
            status: "Starting",
            instanceType: isStarting.instanceType,
        };

    const isRunning = await checkIfServerIsRunning(game, serverId);

    if (isRunning)
        return {
            status: "Running",
            ipAddress: isRunning.ipAddress,
            instanceType: isRunning.instanceType,
        };

    const isStopping = await checkIfServerIsStopping(game, serverId);

    if (isStopping)
        return {
            status: "Stopping",
        };

    const isBackingUpVolume = await checkIfBackingUpVolume(game, serverId);

    if (isBackingUpVolume)
        return {
            status: "Stopping",
        };

    const isBackupComplete = await checkIfImageExists(game, serverId);

    if (isBackupComplete)
        return {
            status: "Stopped",
        };

    const isArchived = await checkIfArchived(game, serverId);

    if (isArchived)
        return {
            status: "Archived",
        };

    throw new AWSError("Unknown state.");
}

const instanceState = [
    "pending",
    "running",
    "shutting-down",
    "terminated",
    "stopping",
    "stopped",
] as const;

export async function checkIfServerIsStarting(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeInstancesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
                {
                    Name: "instance-state-name",
                    Values: ["pending"],
                },
            ],
        })
    );

    const reservations = z
        .object({
            ReservationId: z.string(),
            Instances: z.any(),
        })
        .array()
        .max(1)
        .parse(response.Reservations);

    if (reservations.length === 0) return null;

    const instances = z
        .object({
            InstanceId: z.string(),
            InstanceType: z.string(),
            State: z.object({
                Name: z.enum(instanceState),
            }),
        })
        .array()
        .length(1)
        .parse(reservations[0].Instances);

    const instance = instances[0];

    return {
        instanceType: instance.InstanceType,
        instanceId: instance.InstanceId,
        instanceState: instance.State.Name,
    };
}

export async function checkIfServerIsRunning(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeInstancesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
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

    const reservations = z.any().array().max(1).parse(response.Reservations);

    if (reservations.length === 0) return null;

    const instances = z
        .object({
            InstanceId: z.string(),
            InstanceType: z.string(),
            PublicIpAddress: z.string().optional(),
            State: z.object({
                Name: z.enum(instanceState),
            }),
        })
        .array()
        .length(1)
        .parse(reservations[0].Instances);

    const instance = instances[0];

    return {
        ipAddress: instance.PublicIpAddress,
        instanceType: instance.InstanceType,
        instanceId: instance.InstanceId,
        instanceState: instance.State.Name,
    };
}

export async function checkIfServerIsStopping(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeInstancesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
                {
                    Name: "instance-state-name",
                    Values: ["stopping", "shutting-down"],
                },
            ],
        })
    );

    const reservations = z.any().array().max(1).parse(response.Reservations);
    if (reservations.length === 0) return null;
    const instances = z
        .object({
            InstanceId: z.string(),
            InstanceType: z.string(),
            State: z.object({
                Name: z.enum(instanceState),
            }),
        })
        .array()
        .length(1)
        .parse(reservations[0].Instances);

    const instance = instances[0];

    return {
        instanceType: instance.InstanceType,
        instanceId: instance.InstanceId,
        instanceState: instance.State.Name,
    };
}

export async function checkIfBackingUpVolume(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeVolumesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
            ],
        })
    );

    const volumes = z
        .object({
            State: z.string(),
            VolumeId: z.string(),
            VolumeType: z.string(),
            Size: z.number(),
        })
        .array()
        .max(1)
        .parse(response.Volumes);

    if (volumes.length === 0) return null;

    const volume = volumes[0];

    if (
        volume.State === "creating" ||
        volume.State === "deleting" ||
        volume.State === "available" ||
        volume.State === "in-use"
    )
        return {
            volumeId: volume.VolumeId,
            volumeState: volume.State,
            volumeSize: volume.Size,
            volumeType: volume.VolumeType,
        };

    return null;
}

export async function checkIfImageExists(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeImagesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
            ],
        })
    );

    const images = z
        .object({
            ImageId: z.string(),
        })
        .array()
        .max(2)
        .parse(response.Images);

    if (images.length === 1)
        return {
            imageId: images[0].ImageId,
        };

    return null;
}

export async function checkIfArchived(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeSnapshotsCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
                {
                    Name: "storage-tier",
                    Values: ["archive"],
                },
            ],
        })
    );

    const snapshots = z
        .object({
            SnapshotId: z.string(),
            StorageTier: z.string(),
        })
        .array()
        .max(1)
        .parse(response.Snapshots);

    if (snapshots.length === 0) return null;

    const snapshot = snapshots[0];

    return {
        snapshotId: snapshot.SnapshotId,
        storageTier: snapshot.StorageTier,
    };
}

export type instanceTypes =
    | "t2.small"
    | "t2.medium"
    | "c5a.large"
    | "r5a.large"
    | "r6a.large";

export async function startServer(
    game: string,
    serverId: number,
    configs: { volumeSize: number; instanceType: instanceTypes }
) {
    const image = await checkIfImageExists(game, serverId);

    if (!image) throw new AWSError("AMI not found");

    const templateId = await getLaunchTemplateId(game, serverId);
    const instances = await ec2.send(
        new RunInstancesCommand({
            LaunchTemplate: {
                LaunchTemplateId: templateId,
            },
            BlockDeviceMappings: [
                {
                    DeviceName: "/dev/sda1",
                    Ebs: {
                        DeleteOnTermination: false,
                        VolumeSize: configs.volumeSize,
                        VolumeType: "gp2",
                    },
                },
            ],
            InstanceType: configs.instanceType,
            ImageId: image.imageId,
            MinCount: 1,
            MaxCount: 1,
        })
    );
}

async function getLaunchTemplateId(game: string, serverId: number) {
    const response = await ec2.send(
        new DescribeLaunchTemplatesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: [game],
                },
                {
                    Name: "tag:ServerId",
                    Values: [String(serverId)],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
            ],
        })
    );

    const launchTemplates = z
        .object({
            LaunchTemplateId: z.string(),
        })
        .array()
        .length(1)
        .parse(response.LaunchTemplates);

    return launchTemplates[0].LaunchTemplateId;
}
