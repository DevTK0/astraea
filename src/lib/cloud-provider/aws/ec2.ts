import {
    AuthorizeSecurityGroupIngressCommand,
    DescribeImagesCommand,
    DescribeInstancesCommand,
    DescribeLaunchTemplatesCommand,
    DescribeSecurityGroupRulesCommand,
    DescribeSnapshotsCommand,
    DescribeVolumesCommand,
    EC2Client,
    IpRange,
    RebootInstancesCommand,
    RevokeSecurityGroupIngressCommand,
    RunInstancesCommand,
    SecurityGroupRule,
    TerminateInstancesCommand,
    waitUntilInstanceRunning,
    waitUntilInstanceStopped,
} from "@aws-sdk/client-ec2";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import { z } from "zod";

const ec2 = new EC2Client();
const ssm = new SSMClient();

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
                    Values: ["running"],
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

export const instanceTypes = [
    "t2.small",
    "t2.medium",
    "c5a.large",
    "r5a.large",
    "r6a.large",
] as const;

export async function waitForServerIp(game: string, serverId: number) {
    await waitUntilInstanceRunning(
        {
            client: ec2,
            maxWaitTime: 10,
            maxDelay: 2,
            minDelay: 1,
        },
        {
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
                    Values: ["running"],
                },
            ],
        }
    );

    return checkIfServerIsRunning(game, serverId);
}

export async function getLaunchTemplateId(game: string, serverId: number) {
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

export async function runInstance(
    templateId: string,
    imageId: string,
    volumeSize: number,
    instanceType: string
) {
    const checkedInstanceType = z.enum(instanceTypes).parse(instanceType);

    await ec2.send(
        new RunInstancesCommand({
            LaunchTemplate: {
                LaunchTemplateId: templateId,
            },
            BlockDeviceMappings: [
                {
                    DeviceName: "/dev/sda1",
                    Ebs: {
                        DeleteOnTermination: false,
                        VolumeSize: volumeSize,
                        VolumeType: "gp2",
                    },
                },
            ],
            InstanceType: checkedInstanceType,
            ImageId: imageId,
            MinCount: 1,
            MaxCount: 1,
        })
    );
}

export async function terminateInstance(instanceId: string) {
    await ec2.send(
        new TerminateInstancesCommand({
            InstanceIds: [instanceId],
        })
    );
}

const WaiterState = ["SUCCESS"] as const;

export async function waitForInstanceStop(game: string, serverId: number) {
    const response = await waitUntilInstanceStopped(
        {
            client: ec2,
            maxWaitTime: 10,
            maxDelay: 2,
            minDelay: 1,
        },
        {
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
        }
    );
}

export async function restartInstance(instanceId: string) {
    await ec2.send(
        new RebootInstancesCommand({
            InstanceIds: [instanceId],
        })
    );
}

export async function runUnixCommands(instanceId: string, commands: string[]) {
    const res = await ssm.send(
        new SendCommandCommand({
            InstanceIds: [instanceId],
            DocumentName: "AWS-RunShellScript",
            Parameters: {
                commands: commands,
            },
        })
    );
}

export async function getSecurityGroupRules(groupId: string) {
    return await ec2.send(
        new DescribeSecurityGroupRulesCommand({
            Filters: [
                {
                    Name: "group-id",
                    Values: [groupId],
                },
            ],
        })
    );
}

export async function removeSecurityGroupRules(
    groupId: string,
    rules: SecurityGroupRule[]
) {
    const removed = await ec2.send(
        new RevokeSecurityGroupIngressCommand({
            GroupId: groupId,
            SecurityGroupRuleIds: rules.map((rule) =>
                rule.SecurityGroupRuleId ? rule.SecurityGroupRuleId : ""
            ),
        })
    );
}

export async function addSecurityGroupRules(
    groupId: string,
    ipRanges: IpRange[],
    protocol: string,
    fromPort: number,
    toPort: number
) {
    return await ec2.send(
        new AuthorizeSecurityGroupIngressCommand({
            GroupId: groupId,
            IpPermissions: [
                {
                    FromPort: fromPort,
                    ToPort: toPort,
                    IpProtocol: protocol,
                    IpRanges: ipRanges,
                },
            ],
        })
    );
}
