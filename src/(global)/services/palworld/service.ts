import "server-only";

import { z } from "zod";
import {
    checkIfServerIsRunning,
    runUnixCommands,
    uploadFileToS3,
} from "../../lib/cloud-provider/aws/ec2";
import { serverSettingsSchema } from "./rest-api";
import { updateGameConfigs } from "../database/db-configs";

export async function updatePalworld(serverId: number) {
    const response = await checkIfServerIsRunning(serverId);

    const updateCommand = [
        `runuser -l palworld -c '/home/palworld/Palworld/update.sh'`,
    ];

    const instanceId = z.string().parse(response?.instanceId);

    await runUnixCommands(instanceId, updateCommand);
}

// export async function startPalworld(serverId: number) {
//     const response = await checkIfServerIsRunning(palworld.key, serverId);

//     const updateCommand = [
//         `runuser -l palworld -c '/home/palworld/Palworld/start.sh'`,
//     ];

//     const instanceId = z.string().parse(response?.instanceId);

//     await runUnixCommands(instanceId, updateCommand);
// }

export function generateSettings(
    userSettings: z.output<typeof userSettingsSchema>,
    rates: z.output<typeof serverRatesSchema>
) {
    const settings = {
        ...userSettings,
        ...rates,
        // administration
        ServerName: "Default Palworld Server",
        ServerDescription: "",
        AdminPassword: process.env.PALWORLD_ADMIN_PASSWORD,
        ServerPassword: process.env.PALWORLD_SERVER_PASSWORD,
        PublicPort: 8211,
        PublicIP: "",
        RCONEnabled: true,
        RCONPort: 25575,
        Region: "",
        bUseAuth: true,
        BanListURL: "https://api.palworldgame.com/api/banlist.txt",
        RESTAPIEnabled: true,
        RESTAPIPort: 8212,
        bShowPlayerList: true,
        AllowConnectPlatform: "Steam",
        bIsUseBackupSaveData: true,
        LogFormatType: "json",
    };

    return settings;
}

export async function updatePalworldSettings(
    userSettings: z.output<typeof userSettingsSchema>
) {
    const rates = {
        ExpRate: 1,
        PalCaptureRate: 1,
        PalSpawnNumRate: 1,
        EnemyDropItemRate: 1,
        PalEggDefaultHatchingTime: 10,
        WorkSpeedRate: 1,
    };

    const fullSettings = generateSettings(userSettings, rates);
    const formattedSettings = formatPalworldSettings(fullSettings);
    const fileContents = `[/Script/Pal.PalGameWorldSettings]\n${convertToOptionSettings(
        formattedSettings
    )}`;

    await uploadFileToS3(
        "astraea-typef",
        "1/PalWorldSettings.ini",
        fileContents
    );

    // update database configs
    const configs = serverSettingsSchema.parse(fullSettings);

    await updateGameConfigs(1, configs);
}

function Boolean(bool: boolean) {
    return bool ? "True" : "False";
}

export const serverRatesSchema = z.object({
    ExpRate: z.number(),
    PalCaptureRate: z.number(),
    PalSpawnNumRate: z.number(),
    EnemyDropItemRate: z.number(),
    PalEggDefaultHatchingTime: z.number(),
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

function formatPalworldSettings(
    settings: z.output<typeof serverSettingsSchema>
) {
    const serverSettings = {
        Difficulty: settings.Difficulty,
        DayTimeSpeedRate: settings?.DayTimeSpeedRate.toFixed(6),
        NightTimeSpeedRate: settings.NightTimeSpeedRate.toFixed(6),
        PalDamageRateAttack: settings.PalDamageRateAttack.toFixed(6),
        PalDamageRateDefense: settings.PalDamageRateDefense.toFixed(6),
        PlayerDamageRateAttack: settings.PlayerDamageRateAttack.toFixed(6),
        PlayerDamageRateDefense: settings.PlayerDamageRateDefense.toFixed(6),
        PlayerStomachDecreaceRate:
            settings.PlayerStomachDecreaceRate.toFixed(6),
        PlayerStaminaDecreaceRate:
            settings.PlayerStaminaDecreaceRate.toFixed(6),
        PlayerAutoHPRegeneRate: settings.PlayerAutoHPRegeneRate.toFixed(6),
        PlayerAutoHpRegeneRateInSleep:
            settings.PlayerAutoHpRegeneRateInSleep.toFixed(6),
        PalStomachDecreaceRate: settings.PalStomachDecreaceRate.toFixed(6),
        PalStaminaDecreaceRate: settings.PalStaminaDecreaceRate.toFixed(6),
        PalAutoHPRegeneRate: settings.PalAutoHPRegeneRate.toFixed(6),
        PalAutoHpRegeneRateInSleep:
            settings.PalAutoHpRegeneRateInSleep.toFixed(6),
        BuildObjectDamageRate: settings.BuildObjectDamageRate.toFixed(6),
        BuildObjectDeteriorationDamageRate:
            settings.BuildObjectDeteriorationDamageRate.toFixed(6),
        CollectionDropRate: settings.CollectionDropRate.toFixed(6),
        CollectionObjectHpRate: settings.CollectionObjectHpRate.toFixed(6),
        CollectionObjectRespawnSpeedRate:
            settings.CollectionObjectRespawnSpeedRate.toFixed(6),
        DeathPenalty: settings.DeathPenalty,
        bEnablePlayerToPlayerDamage: Boolean(
            settings.bEnablePlayerToPlayerDamage
        ),
        bEnableFriendlyFire: Boolean(settings.bEnableFriendlyFire),
        bEnableInvaderEnemy: Boolean(settings.bEnableInvaderEnemy),
        bActiveUNKO: Boolean(settings.bActiveUNKO),
        bEnableAimAssistPad: Boolean(settings.bEnableAimAssistPad),
        bEnableAimAssistKeyboard: Boolean(settings.bEnableAimAssistKeyboard),
        DropItemMaxNum: settings.DropItemMaxNum.toFixed(0),
        DropItemMaxNum_UNKO: settings.DropItemMaxNum_UNKO.toFixed(0),
        BaseCampMaxNum: settings.BaseCampMaxNum.toFixed(0),
        BaseCampWorkerMaxNum: settings.BaseCampWorkerMaxNum.toFixed(0),
        DropItemAliveMaxHours: settings.DropItemAliveMaxHours.toFixed(6),
        bAutoResetGuildNoOnlinePlayers: Boolean(
            settings.bAutoResetGuildNoOnlinePlayers
        ),
        AutoResetGuildTimeNoOnlinePlayers:
            settings.AutoResetGuildTimeNoOnlinePlayers.toFixed(6),
        GuildPlayerMaxNum: settings.GuildPlayerMaxNum.toFixed(0),
        bIsMultiplay: Boolean(settings.bIsMultiplay),
        bIsPvP: Boolean(settings.bIsPvP),
        bCanPickupOtherGuildDeathPenaltyDrop: Boolean(
            settings.bCanPickupOtherGuildDeathPenaltyDrop
        ),
        bEnableNonLoginPenalty: Boolean(settings.bEnableNonLoginPenalty),
        bEnableFastTravel: Boolean(settings.bEnableFastTravel),
        bIsStartLocationSelectByMap: Boolean(
            settings.bIsStartLocationSelectByMap
        ),
        bExistPlayerAfterLogout: Boolean(settings.bExistPlayerAfterLogout),
        bEnableDefenseOtherGuildPlayer: Boolean(
            settings.bEnableDefenseOtherGuildPlayer
        ),
        CoopPlayerMaxNum: settings.CoopPlayerMaxNum.toFixed(0),
        ServerPlayerMaxNum: settings.ServerPlayerMaxNum.toFixed(0),
        // rates
        ExpRate: settings.ExpRate.toFixed(6),
        PalCaptureRate: settings.PalCaptureRate.toFixed(6),
        PalSpawnNumRate: settings.PalSpawnNumRate.toFixed(6),
        EnemyDropItemRate: settings.EnemyDropItemRate.toFixed(6),
        PalEggDefaultHatchingTime:
            settings.PalEggDefaultHatchingTime.toFixed(6),
        WorkSpeedRate: settings.WorkSpeedRate.toFixed(6),
        // administration
        ServerName: `"Default Palworld Server"`,
        ServerDescription: `""`,
        AdminPassword: `"${process.env.PALWORLD_ADMIN_PASSWORD}"`,
        ServerPassword: `"${process.env.PALWORLD_SERVER_PASSWORD}"`,
        PublicPort: 8211,
        PublicIP: `""`,
        RCONEnabled: Boolean(true),
        RCONPort: 25575,
        Region: `""`,
        bUseAuth: Boolean(true),
        BanListURL: `"https://api.palworldgame.com/api/banlist.txt"`,
        RESTAPIEnabled: Boolean(true),
        RESTAPIPort: 8212,
        bShowPlayerList: Boolean(true),
        AllowConnectPlatform: `Steam`,
        bIsUseBackupSaveData: Boolean(true),
    };

    return serverSettings;
}

function convertToOptionSettings(settings: Record<string, any>) {
    return `OptionSettings=(Difficulty=${settings.Difficulty},DayTimeSpeedRate=${settings.DayTimeSpeedRate},NightTimeSpeedRate=${settings.NightTimeSpeedRate},ExpRate=${settings.ExpRate},PalCaptureRate=${settings.PalCaptureRate},PalSpawnNumRate=${settings.PalSpawnNumRate},PalDamageRateAttack=${settings.PalDamageRateAttack},PalDamageRateDefense=${settings.PalDamageRateDefense},PlayerDamageRateAttack=${settings.PlayerDamageRateAttack},PlayerDamageRateDefense=${settings.PlayerDamageRateDefense},PlayerStomachDecreaceRate=${settings.PlayerStomachDecreaceRate},PlayerStaminaDecreaceRate=${settings.PlayerStaminaDecreaceRate},PlayerAutoHPRegeneRate=${settings.PlayerAutoHPRegeneRate},PlayerAutoHpRegeneRateInSleep=${settings.PlayerAutoHpRegeneRateInSleep},PalStomachDecreaceRate=${settings.PalStomachDecreaceRate},PalStaminaDecreaceRate=${settings.PalStaminaDecreaceRate},PalAutoHPRegeneRate=${settings.PalAutoHPRegeneRate},PalAutoHpRegeneRateInSleep=${settings.PalAutoHpRegeneRateInSleep},BuildObjectDamageRate=${settings.BuildObjectDamageRate},BuildObjectDeteriorationDamageRate=${settings.BuildObjectDeteriorationDamageRate},CollectionDropRate=${settings.CollectionDropRate},CollectionObjectHpRate=${settings.CollectionObjectHpRate},CollectionObjectRespawnSpeedRate=${settings.CollectionObjectRespawnSpeedRate},EnemyDropItemRate=${settings.EnemyDropItemRate},DeathPenalty=${settings.DeathPenalty},bEnablePlayerToPlayerDamage=${settings.bEnablePlayerToPlayerDamage},bEnableFriendlyFire=${settings.bEnableFriendlyFire},bEnableInvaderEnemy=${settings.bEnableInvaderEnemy},bActiveUNKO=${settings.bActiveUNKO},bEnableAimAssistPad=${settings.bEnableAimAssistPad},bEnableAimAssistKeyboard=${settings.bEnableAimAssistKeyboard},DropItemMaxNum=${settings.DropItemMaxNum},DropItemMaxNum_UNKO=${settings.DropItemMaxNum_UNKO},BaseCampMaxNum=${settings.BaseCampMaxNum},BaseCampWorkerMaxNum=${settings.BaseCampWorkerMaxNum},DropItemAliveMaxHours=${settings.DropItemAliveMaxHours},bAutoResetGuildNoOnlinePlayers=${settings.bAutoResetGuildNoOnlinePlayers},AutoResetGuildTimeNoOnlinePlayers=${settings.AutoResetGuildTimeNoOnlinePlayers},GuildPlayerMaxNum=${settings.GuildPlayerMaxNum},PalEggDefaultHatchingTime=${settings.PalDefaultHatchingTime},WorkSpeedRate=${settings.WorkSpeedRate},bIsMultiplay=${settings.bIsMultiplay},bIsPvP=${settings.bIsPvP},bCanPickupOtherGuildDeathPenaltyDrop=${settings.bCanPickupOtherGuildDeathPenaltyDrop},bEnableNonLoginPenalty=${settings.bEnableNonLoginPenalty},bEnableFastTravel=${settings.bEnableFastTravel},bIsStartLocationSelectByMap=${settings.bIsStartLocationSelectByMap},bExistPlayerAfterLogout=${settings.bExistPlayerAfterLogout},bEnableDefenseOtherGuildPlayer=${settings.bEnableDefenseOtherGuildPlayer},CoopPlayerMaxNum=${settings.CoopPlayerMaxNum},ServerPlayerMaxNum=${settings.ServerPlayerMaxNum},ServerName=${settings.ServerName},ServerDescription=${settings.ServerDescription},AdminPassword=${settings.AdminPassword},ServerPassword=${settings.ServerPassword},PublicPort=${settings.PublicPort},PublicIP=${settings.PublicIP},RCONEnabled=${settings.RCONEnabled},RCONPort=${settings.RCONPort},Region=${settings.Region},bUseAuth=${settings.bUseAuth},BanListURL=${settings.BanListURL},RESTAPIEnabled=${settings.RESTAPIEnabled},RESTAPIPort=${settings.RESTAPIPort},bShowPlayerList=${settings.bShowPlayerList},AllowConnectPlatform=${settings.AllowConnectPlatform},bIsUseBackupSaveData=${settings.bIsUseBackupSaveData})`;
}
