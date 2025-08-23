import "server-only";

import { ServerError } from "@/(global)/lib/exception/next-safe-action";
import {
    addSecurityGroupRules,
    checkIfArchived,
    checkIfBackingUpVolume,
    checkIfImageExists,
    checkIfServerIsRunning,
    checkIfServerIsStarting,
    checkIfServerIsStopping,
    getLaunchTemplateId,
    getSecurityGroupRules,
    removeSecurityGroupRules,
    restartInstance,
    runInstance,
    terminateInstance,
    InstanceType,
} from "./aws/ec2";
import { AWSError } from "../exception/aws";
import { z } from "zod";

const dryRun = process.env.DRY_RUN === "true";

export type ServerStatus =
    | "Starting"
    | "Running"
    | "Stopping"
    | "Stopped"
    | "Archived";

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
export const getServerStatus = async (
    game: string,
    serverId: number
): Promise<{
    status: ServerStatus;
    ipAddress?: string;
    instanceType?: string;
}> => {
    const isStarting = await checkIfServerIsStarting(game, serverId);

    if (isStarting)
        return {
            status: "Starting",
            instanceType: isStarting.instanceType,
        };

    const isRunning = await checkIfServerIsRunning(serverId);

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

    throw new ServerError("Unknown state.");
};

export async function getServerAddress(game: string, serverId: number) {
    const isRunning = await checkIfServerIsRunning(serverId);

    if (!isRunning) throw new ServerError("Server is not running");

    const serverAddress = z
        .string()
        .ip({ message: "Server ipAddress is invalid." })
        .parse(isRunning?.ipAddress);

    return serverAddress;
}

export async function startServer(
    game: string,
    serverId: number,
    options: { volumeSize: number; instanceType: string }
) {
    console.log("hi");
    const instance = await getServerStatus(game, serverId);
    console.log(instance);

    if (instance.status === "Running")
        throw new ServerError("Server is already running");
    if (instance.status === "Starting")
        throw new ServerError("Server is already starting");
    if (instance.status === "Stopping")
        throw new ServerError("Server is stopping");
    if (instance.status === "Archived")
        throw new ServerError("Server is archived");

    const image = await checkIfImageExists(game, serverId);
    console.log(image);

    if (!image) throw new AWSError("AMI not found");

    const templateId = await getLaunchTemplateId(game, serverId);
    console.log(templateId);

    await runInstance(
        templateId,
        image.imageId,
        options.volumeSize,
        options.instanceType
    );
}

export async function stopServer(serverId: number) {
    const instance = await checkIfServerIsRunning(serverId);

    if (!instance) throw new ServerError("Server is not running");

    const instanceId = z.string().parse(instance?.instanceId);

    await terminateInstance(instanceId);
}

export async function safeStop(serverId: number) {
    try {
        await stopServer(serverId);
    } catch {}
}

export async function restartServer(game: string, serverId: number) {
    const instance = await checkIfServerIsRunning(serverId);
    if (!instance) throw new ServerError("Server is not running");
    const instanceId = z.string().parse(instance?.instanceId);
    await restartInstance(instanceId);
}

export async function configureAllowedIPs(
    ipAddresses: string[],
    protocol: string,
    port: number,
    securityGroupId: string
) {
    const ipList: string[] = [];
    const ipRanges = [];

    // extract ip address from each user that has joined the seerver
    for (const ip of ipAddresses) {
        if (ip == "") continue;

        z.string().ip({ version: "v4" }).parse(ip);

        // remove duplicates
        if (!ipList.includes(ip)) {
            const ipRange = {
                CidrIp: ip + "/32",
                Description: "IP Whitelist",
            };
            ipList.push(ip);
            ipRanges.push(ipRange);
        }
    }

    z.string().array().nonempty().parse(ipList);

    const securityGroupRules = await getSecurityGroupRules(securityGroupId);

    const toRemove = securityGroupRules.SecurityGroupRules?.filter((rule) => {
        return (
            rule.IpProtocol === protocol &&
            rule.FromPort === port &&
            rule.Description == "IP Whitelist"
        );
    });

    // Remove previous Ips if any
    if (toRemove && toRemove.length > 0) {
        await removeSecurityGroupRules(securityGroupId, toRemove);
    }

    await addSecurityGroupRules(
        securityGroupId,
        ipRanges,
        protocol,
        port,
        port
    );
}
