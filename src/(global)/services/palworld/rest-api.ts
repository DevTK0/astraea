import { configs } from "@/(global)/configs/servers/palworld";
import { fetchWithErrorHandling } from "@/(global)/lib/request/fetch";
import { z } from "zod";

export async function checkIfClientIsRunning(address: string) {
    try {
        await getServerInfo(address);
    } catch (error) {
        if (
            error instanceof TypeError &&
            error.cause instanceof Error &&
            error.cause.message.includes("ECONNREFUSED")
        ) {
            return false;
        }
    }

    return true;
}

export async function getServerInfo(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/info`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export const playerListSchema = z
    .object({
        name: z.string(),
        // playerid: z.string(),
        // userid: z.string(),
        ip: z.string(),
        ping: z.coerce.number(),
        location_x: z.coerce.number(),
        location_y: z.coerce.number(),
        level: z.coerce.number(),
    })
    .array();

export async function getPlayerList(address: string) {
    const response = await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/players`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
    return playerListSchema.parse(response.players);
}

export const serverSettingsSchema = z.object({
    Difficulty: z.string(),
    DayTimeSpeedRate: z.number(),
    NightTimeSpeedRate: z.number(),
    ExpRate: z.number(),
    PalCaptureRate: z.number(),
    PalSpawnNumRate: z.number(),
    PalDamageRateAttack: z.number(),
    PalDamageRateDefense: z.number(),
    PlayerDamageRateAttack: z.number(),
    PlayerDamageRateDefense: z.number(),
    PlayerStomachDecreaceRate: z.number(),
    PlayerStaminaDecreaceRate: z.number(),
    PlayerAutoHPRegeneRate: z.number(),
    PlayerAutoHpRegeneRateInSleep: z.number(),
    PalStomachDecreaceRate: z.number(),
    PalStaminaDecreaceRate: z.number(),
    PalAutoHPRegeneRate: z.number(),
    PalAutoHpRegeneRateInSleep: z.number(),
    BuildObjectDamageRate: z.number(),
    BuildObjectDeteriorationDamageRate: z.number(),
    CollectionDropRate: z.number(),
    CollectionObjectHpRate: z.number(),
    CollectionObjectRespawnSpeedRate: z.number(),
    EnemyDropItemRate: z.number(),
    DeathPenalty: z.string(),
    bEnablePlayerToPlayerDamage: z.boolean(),
    bEnableFriendlyFire: z.boolean(),
    bEnableInvaderEnemy: z.boolean(),
    bActiveUNKO: z.boolean(),
    bEnableAimAssistPad: z.boolean(),
    bEnableAimAssistKeyboard: z.boolean(),
    DropItemMaxNum: z.number(),
    DropItemMaxNum_UNKO: z.number(),
    BaseCampMaxNum: z.number(),
    BaseCampWorkerMaxNum: z.number(),
    DropItemAliveMaxHours: z.number(),
    bAutoResetGuildNoOnlinePlayers: z.boolean(),
    AutoResetGuildTimeNoOnlinePlayers: z.number(),
    GuildPlayerMaxNum: z.number(),
    PalEggDefaultHatchingTime: z.number(),
    WorkSpeedRate: z.number(),
    bIsMultiplay: z.boolean(),
    bIsPvP: z.boolean(),
    bCanPickupOtherGuildDeathPenaltyDrop: z.boolean(),
    bEnableNonLoginPenalty: z.boolean(),
    bEnableFastTravel: z.boolean(),
    bIsStartLocationSelectByMap: z.boolean(),
    bExistPlayerAfterLogout: z.boolean(),
    bEnableDefenseOtherGuildPlayer: z.boolean(),
    CoopPlayerMaxNum: z.number(),
    ServerPlayerMaxNum: z.number(),
    ServerName: z.string(),
    ServerDescription: z.string(),
    PublicPort: z.number(),
    PublicIP: z.string(),
    RCONEnabled: z.boolean(),
    RCONPort: z.number(),
    Region: z.string(),
    bUseAuth: z.boolean(),
    BanListURL: z.string(),
    RESTAPIEnabled: z.boolean(),
    RESTAPIPort: z.number(),
    bShowPlayerList: z.boolean(),
    AllowConnectPlatform: z.string(),
    bIsUseBackupSaveData: z.boolean(),
    LogFormatType: z.string(),
});

export async function getServerSettings(address: string) {
    const response = await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/settings`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );

    return serverSettingsSchema
        .omit({
            PublicIP: true,
            PublicPort: true,
            RCONEnabled: true,
            RCONPort: true,
            bUseAuth: true,
            BanListURL: true,
            RESTAPIEnabled: true,
            RESTAPIPort: true,
            bShowPlayerList: true,
            AllowConnectPlatform: true,
            bIsUseBackupSaveData: true,
            LogFormatType: true,
        })
        .parse(JSON.parse(response));
}

export async function getServerMetrics(address: string) {
    const response = await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/metrics`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );

    return z
        .object({
            currentplayernum: z.number(),
            serverfps: z.number(),
            serverframetime: z.number(),
            maxplayernum: z.number(),
            uptime: z.number(),
        })
        .parse(response);
}

export async function announceMessage(address: string, message: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/announce`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
            body: JSON.stringify({ message: message }),
        }
    );
}

export async function kickPlayer(
    address: string,
    userId: string,
    message: string
) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/kick`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
            body: JSON.stringify({ userId: userId, message: message }),
        }
    );
}

export async function banPlayer(
    address: string,
    userId: string,
    reason: string
) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/ban`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
                body: JSON.stringify({ userid: userId, message: reason }),
            },
        }
    );
}

export async function unbanPlayer(
    address: string,
    userId: string,
    reason: string
) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/unban`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
                body: JSON.stringify({ userId: userId, message: reason }),
            },
        }
    );
}

export async function save(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/save`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export async function shutdown(address: string, wait: number, message: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/shutdown`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
            body: JSON.stringify({ waitTime: wait, message: message }),
        }
    );
}

export async function forceStop(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/stop`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}
