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
    runUnixCommands,
    terminateInstance,
} from "./aws/ec2";
import { AWSError } from "../exception/aws";
import { z } from "zod";
import { serverSettingsSchema } from "../palworld/rest-api";
import { configs } from "@/(global)/configs/servers/palworld";

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

    throw new ServerError("Unknown state.");
};

export async function getServerAddress(game: string, serverId: number) {
    const isRunning = await checkIfServerIsRunning(game, serverId);

    if (!isRunning) throw new ServerError("Server is not running");

    const serverAddress = z.string().ip().parse(isRunning?.ipAddress);

    return serverAddress;
}

export async function startServer(
    game: string,
    serverId: number,
    options: { volumeSize: number; instanceType: string }
) {
    const instance = await getServerStatus(game, serverId);

    if (instance.status === "Running")
        throw new ServerError("Server is already running");
    if (instance.status === "Starting")
        throw new ServerError("Server is already starting");
    if (instance.status === "Stopping")
        throw new ServerError("Server is stopping");
    if (instance.status === "Archived")
        throw new ServerError("Server is archived");

    const image = await checkIfImageExists(game, serverId);

    if (!image) throw new AWSError("AMI not found");

    const templateId = await getLaunchTemplateId(game, serverId);

    await runInstance(
        templateId,
        image.imageId,
        options.volumeSize,
        options.instanceType
    );
}

export async function stopServer(game: string, serverId: number) {
    const instance = await checkIfServerIsRunning(game, serverId);

    if (!instance) throw new ServerError("Server is not running");

    const instanceId = z.string().parse(instance?.instanceId);

    await terminateInstance(instanceId);
}

export async function restartServer(game: string, serverId: number) {
    const instance = await checkIfServerIsRunning(game, serverId);
    if (!instance) throw new ServerError("Server is not running");
    const instanceId = z.string().parse(instance?.instanceId);
    await restartInstance(instanceId);
}

export async function configureAllowedIPs(
    ipAddresses: string[],
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
        return rule.IpProtocol === "udp" && rule.FromPort === 8211;
    });

    // Remove previous Ips if any
    if (toRemove && toRemove.length > 0) {
        await removeSecurityGroupRules(securityGroupId, toRemove);
    }

    await addSecurityGroupRules(securityGroupId, ipRanges, "udp", 8211, 8211);
}

export async function updatePalworld() {
    const response = await checkIfServerIsRunning("Palworld", 1);

    const updateCommand = [
        `runuser -l palworld -c '/home/palworld/Palworld/update.sh'`,
    ];

    const instanceId = z.string().parse(response?.instanceId);

    await runUnixCommands(instanceId, updateCommand);
}

export async function startPalworld() {
    const response = await checkIfServerIsRunning("Palworld", 1);

    const updateCommand = [
        `runuser -l palworld -c '/home/palworld/Palworld/start.sh'`,
    ];

    const instanceId = z.string().parse(response?.instanceId);

    await runUnixCommands(instanceId, updateCommand);
}

export async function updatePalworldSettings(
    settings: z.output<typeof userSettingsSchema>
) {
    const response = await checkIfServerIsRunning("Palworld", 1);

    const instanceId = z.string().parse(response?.instanceId);

    const rates = {
        ExpRate: 1,
        PalCaptureRate: 1,
        PalSpawnNumRate: 1,
        EnemyDropItemRate: 1,
        PalDefaultHatchingTime: 10,
        WorkSpeedRate: 1,
    };

    const fileContents = parsePalworldSettings(settings, rates);

    const commands = [
        String.raw`runuser -l palworld -c 'echo [/Script/Pal.PalGameWorldSettings] > ${configs.settingsFilePath}/PalWorldSettings.ini'`,
        String.raw`runuser -l palworld -c 'echo -e ${fileContents} >> ${configs.settingsFilePath}/PalWorldSettings.ini'`,
    ];

    await runUnixCommands(instanceId, commands);
}

function Boolean(bool: boolean) {
    return bool ? "True" : "False";
}

export const serverRatesSchema = z.object({
    ExpRate: z.number(),
    PalCaptureRate: z.number(),
    PalSpawnNumRate: z.number(),
    EnemyDropItemRate: z.number(),
    PalDefaultHatchingTime: z.number(),
    WorkSpeedRate: z.number(),
});

export const userSettingsSchema = serverSettingsSchema.pick({
    Difficulty: true,
    DayTimeSpeedRate: true,
    NightTimeSpeedRate: true,
    PalDamageRateAttack: true,
    PalDamageRateDefense: true,
    PlayerDamageRateAttack: true,
    PlayerDamageRateDefense: true,
    PlayerStomachDecreaceRate: true,
    PlayerStaminaDecreaceRate: true,
    PlayerAutoHPRegeneRate: true,
    PlayerAutoHpRegeneRateInSleep: true,
    PalStomachDecreaceRate: true,
    PalStaminaDecreaceRate: true,
    PalAutoHPRegeneRate: true,
    PalAutoHpRegeneRateInSleep: true,
    BuildObjectDamageRate: true,
    BuildObjectDeteriorationDamageRate: true,
    CollectionDropRate: true,
    CollectionObjectHpRate: true,
    CollectionObjectRespawnSpeedRate: true,
    DeathPenalty: true,
    bEnablePlayerToPlayerDamage: true,
    bEnableFriendlyFire: true,
    bEnableInvaderEnemy: true,
    bActiveUNKO: true,
    bEnableAimAssistPad: true,
    bEnableAimAssistKeyboard: true,
    DropItemMaxNum: true,
    DropItemMaxNum_UNKO: true,
    BaseCampMaxNum: true,
    BaseCampWorkerMaxNum: true,
    DropItemAliveMaxHours: true,
    bAutoResetGuildNoOnlinePlayers: true,
    AutoResetGuildTimeNoOnlinePlayers: true,
    GuildPlayerMaxNum: true,
    bIsMultiplay: true,
    bIsPvP: true,
    bCanPickupOtherGuildDeathPenaltyDrop: true,
    bEnableNonLoginPenalty: true,
    bEnableFastTravel: true,
    bIsStartLocationSelectByMap: true,
    bExistPlayerAfterLogout: true,
    bEnableDefenseOtherGuildPlayer: true,
    CoopPlayerMaxNum: true,
    ServerPlayerMaxNum: true,
});

function parsePalworldSettings(
    settings: z.output<typeof userSettingsSchema>,
    rates: z.output<typeof serverRatesSchema>
) {
    // convert data to appropriate string format.
    const Difficulty = settings.Difficulty;
    const DayTimeSpeedRate = settings?.DayTimeSpeedRate.toFixed(6);
    const NightTimeSpeedRate = settings.NightTimeSpeedRate.toFixed(6);
    const PalDamageRateAttack = settings.PalDamageRateAttack.toFixed(6);
    const PalDamageRateDefense = settings.PalDamageRateDefense.toFixed(6);
    const PlayerDamageRateAttack = settings.PlayerDamageRateAttack.toFixed(6);
    const PlayerDamageRateDefense = settings.PlayerDamageRateDefense.toFixed(6);
    const PlayerStomachDecreaceRate =
        settings.PlayerStomachDecreaceRate.toFixed(6);
    const PlayerStaminaDecreaceRate =
        settings.PlayerStaminaDecreaceRate.toFixed(6);
    const PlayerAutoHPRegeneRate = settings.PlayerAutoHPRegeneRate.toFixed(6);
    const PlayerAutoHpRegeneRateInSleep =
        settings.PlayerAutoHpRegeneRateInSleep.toFixed(6);
    const PalStomachDecreaceRate = settings.PalStomachDecreaceRate.toFixed(6);
    const PalStaminaDecreaceRate = settings.PalStaminaDecreaceRate.toFixed(6);
    const PalAutoHPRegeneRate = settings.PalAutoHPRegeneRate.toFixed(6);
    const PalAutoHpRegeneRateInSleep =
        settings.PalAutoHpRegeneRateInSleep.toFixed(6);
    const BuildObjectDamageRate = settings.BuildObjectDamageRate.toFixed(6);
    const BuildObjectDeteriorationDamageRate =
        settings.BuildObjectDeteriorationDamageRate.toFixed(6);
    const CollectionDropRate = settings.CollectionDropRate.toFixed(6);
    const CollectionObjectHpRate = settings.CollectionObjectHpRate.toFixed(6);
    const CollectionObjectRespawnSpeedRate =
        settings.CollectionObjectRespawnSpeedRate.toFixed(6);
    const DeathPenalty = settings.DeathPenalty;
    const bEnablePlayerToPlayerDamage = Boolean(
        settings.bEnablePlayerToPlayerDamage
    );
    const bEnableFriendlyFire = Boolean(settings.bEnableFriendlyFire);
    const bEnableInvaderEnemy = Boolean(settings.bEnableInvaderEnemy);
    const bActiveUNKO = Boolean(settings.bActiveUNKO);
    const bEnableAimAssistPad = Boolean(settings.bEnableAimAssistPad);
    const bEnableAimAssistKeyboard = Boolean(settings.bEnableAimAssistKeyboard);
    const DropItemMaxNum = settings.DropItemMaxNum.toFixed(0);
    const DropItemMaxNum_UNKO = settings.DropItemMaxNum_UNKO.toFixed(0);
    const BaseCampMaxNum = settings.BaseCampMaxNum.toFixed(0);
    const BaseCampWorkerMaxNum = settings.BaseCampWorkerMaxNum.toFixed(0);
    const DropItemAliveMaxHours = settings.DropItemAliveMaxHours.toFixed(6);
    const bAutoResetGuildNoOnlinePlayers = Boolean(
        settings.bAutoResetGuildNoOnlinePlayers
    );
    const AutoResetGuildTimeNoOnlinePlayers =
        settings.AutoResetGuildTimeNoOnlinePlayers.toFixed(6);
    const GuildPlayerMaxNum = settings.GuildPlayerMaxNum.toFixed(0);
    const bIsMultiplay = Boolean(settings.bIsMultiplay);
    const bIsPvP = Boolean(settings.bIsPvP);
    const bCanPickupOtherGuildDeathPenaltyDrop = Boolean(
        settings.bCanPickupOtherGuildDeathPenaltyDrop
    );
    const bEnableNonLoginPenalty = Boolean(settings.bEnableNonLoginPenalty);
    const bEnableFastTravel = Boolean(settings.bEnableFastTravel);
    const bIsStartLocationSelectByMap = Boolean(
        settings.bIsStartLocationSelectByMap
    );
    const bExistPlayerAfterLogout = Boolean(settings.bExistPlayerAfterLogout);
    const bEnableDefenseOtherGuildPlayer = Boolean(
        settings.bEnableDefenseOtherGuildPlayer
    );
    const CoopPlayerMaxNum = settings.CoopPlayerMaxNum.toFixed(0);
    const ServerPlayerMaxNum = settings.ServerPlayerMaxNum.toFixed(0);

    const ExpRate = rates.ExpRate.toFixed(6);
    const PalCaptureRate = rates.PalCaptureRate.toFixed(6);
    const PalSpawnNumRate = rates.PalSpawnNumRate.toFixed(6);
    const EnemyDropItemRate = rates.EnemyDropItemRate.toFixed(6);
    const PalEggDefaultHatchingTime = rates.PalDefaultHatchingTime.toFixed(6);
    const WorkSpeedRate = rates.WorkSpeedRate.toFixed(6);

    const ServerName = String.raw`\"Default Palworld Server\"`;
    const ServerDescription = String.raw`\"\"`;
    const AdminPassword = String.raw`\"${process.env.PALWORLD_ADMIN_PASSWORD}\"`;
    const ServerPassword = String.raw`\"${process.env.PALWORLD_SERVER_PASSWORD}\"`;
    const PublicPort = 8211;
    const PublicIP = String.raw`\"\"`;
    const RCONEnabled = Boolean(true);
    const RCONPort = 25575;
    const Region = String.raw`\"\"`;
    const bUseAuth = Boolean(true);
    const BanListURL = String.raw`\"https://api.palworldgame.com/api/banlist.txt\"`;
    const RESTAPIEnabled = Boolean(true);
    const RESTAPIPort = 8212;
    const bShowPlayerList = Boolean(true);
    const AllowConnectPlatform = `Steam`;
    const bIsUseBackupSaveData = Boolean(true);

    const fileContents = String.raw`OptionSettings=\(Difficulty=${Difficulty},DayTimeSpeedRate=${DayTimeSpeedRate},NightTimeSpeedRate=${NightTimeSpeedRate},ExpRate=${ExpRate},PalCaptureRate=${PalCaptureRate},PalSpawnNumRate=${PalSpawnNumRate},PalDamageRateAttack=${PalDamageRateAttack},PalDamageRateDefense=${PalDamageRateDefense},PlayerDamageRateAttack=${PlayerDamageRateAttack},PlayerDamageRateDefense=${PlayerDamageRateDefense},PlayerStomachDecreaceRate=${PlayerStomachDecreaceRate},PlayerStaminaDecreaceRate=${PlayerStaminaDecreaceRate},PlayerAutoHPRegeneRate=${PlayerAutoHPRegeneRate},PlayerAutoHpRegeneRateInSleep=${PlayerAutoHpRegeneRateInSleep},PalStomachDecreaceRate=${PalStomachDecreaceRate},PalStaminaDecreaceRate=${PalStaminaDecreaceRate},PalAutoHPRegeneRate=${PalAutoHPRegeneRate},PalAutoHpRegeneRateInSleep=${PalAutoHpRegeneRateInSleep},BuildObjectDamageRate=${BuildObjectDamageRate},BuildObjectDeteriorationDamageRate=${BuildObjectDeteriorationDamageRate},CollectionDropRate=${CollectionDropRate},CollectionObjectHpRate=${CollectionObjectHpRate},CollectionObjectRespawnSpeedRate=${CollectionObjectRespawnSpeedRate},EnemyDropItemRate=${EnemyDropItemRate},DeathPenalty=${DeathPenalty},bEnablePlayerToPlayerDamage=${bEnablePlayerToPlayerDamage},bEnableFriendlyFire=${bEnableFriendlyFire},bEnableInvaderEnemy=${bEnableInvaderEnemy},bActiveUNKO=${bActiveUNKO},bEnableAimAssistPad=${bEnableAimAssistPad},bEnableAimAssistKeyboard=${bEnableAimAssistKeyboard},DropItemMaxNum=${DropItemMaxNum},DropItemMaxNum_UNKO=${DropItemMaxNum_UNKO},BaseCampMaxNum=${BaseCampMaxNum},BaseCampWorkerMaxNum=${BaseCampWorkerMaxNum},DropItemAliveMaxHours=${DropItemAliveMaxHours},bAutoResetGuildNoOnlinePlayers=${bAutoResetGuildNoOnlinePlayers},AutoResetGuildTimeNoOnlinePlayers=${AutoResetGuildTimeNoOnlinePlayers},GuildPlayerMaxNum=${GuildPlayerMaxNum},PalEggDefaultHatchingTime=${PalEggDefaultHatchingTime},WorkSpeedRate=${WorkSpeedRate},bIsMultiplay=${bIsMultiplay},bIsPvP=${bIsPvP},bCanPickupOtherGuildDeathPenaltyDrop=${bCanPickupOtherGuildDeathPenaltyDrop},bEnableNonLoginPenalty=${bEnableNonLoginPenalty},bEnableFastTravel=${bEnableFastTravel},bIsStartLocationSelectByMap=${bIsStartLocationSelectByMap},bExistPlayerAfterLogout=${bExistPlayerAfterLogout},bEnableDefenseOtherGuildPlayer=${bEnableDefenseOtherGuildPlayer},CoopPlayerMaxNum=${CoopPlayerMaxNum},ServerPlayerMaxNum=${ServerPlayerMaxNum},ServerName=${ServerName},ServerDescription=${ServerDescription},AdminPassword=${AdminPassword},ServerPassword=${ServerPassword},PublicPort=${PublicPort},PublicIP=${PublicIP},RCONEnabled=${RCONEnabled},RCONPort=${RCONPort},Region=${Region},bUseAuth=${bUseAuth},BanListURL=${BanListURL},RESTAPIEnabled=${RESTAPIEnabled},RESTAPIPort=${RESTAPIPort},bShowPlayerList=${bShowPlayerList},AllowConnectPlatform=${AllowConnectPlatform},bIsUseBackupSaveData=${bIsUseBackupSaveData}\)`;

    return fileContents;
}
