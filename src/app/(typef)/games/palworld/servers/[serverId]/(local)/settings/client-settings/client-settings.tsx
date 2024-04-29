import {
    getClientSettingsAction,
    isServerRunningAction,
} from "./client-settings.action";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ClientSettingsForm } from "./client-settings.client";
import { serverSettingsSchema } from "@/(global)/lib/palworld/rest-api";

type FormValues = z.infer<typeof serverSettingsSchema>;

const presetValues: Partial<FormValues> = {
    Difficulty: "None",
    DayTimeSpeedRate: 1,
    NightTimeSpeedRate: 1,
    PalDamageRateAttack: 1,
    PalDamageRateDefense: 1,
    PlayerDamageRateAttack: 1,
    PlayerDamageRateDefense: 1,
    PlayerStomachDecreaceRate: 1,
    PlayerStaminaDecreaceRate: 1,
    PlayerAutoHPRegeneRate: 1,
    PlayerAutoHpRegeneRateInSleep: 1,
    PalStomachDecreaceRate: 1,
    PalStaminaDecreaceRate: 1,
    PalAutoHPRegeneRate: 1,
    PalAutoHpRegeneRateInSleep: 1,
    BuildObjectDamageRate: 1,
    BuildObjectDeteriorationDamageRate: 1,
    CollectionDropRate: 1,
    CollectionObjectHpRate: 1,
    CollectionObjectRespawnSpeedRate: 1,
    DeathPenalty: "None",
    bEnablePlayerToPlayerDamage: false,
    bEnableFriendlyFire: false,
    bEnableInvaderEnemy: true,
    bActiveUNKO: false,
    bEnableAimAssistPad: true,
    bEnableAimAssistKeyboard: false,
    DropItemMaxNum: 3000,
    DropItemMaxNum_UNKO: 100,
    BaseCampMaxNum: 128,
    BaseCampWorkerMaxNum: 15,
    DropItemAliveMaxHours: 1,
    bAutoResetGuildNoOnlinePlayers: false,
    AutoResetGuildTimeNoOnlinePlayers: 72,
    GuildPlayerMaxNum: 20,
    bIsMultiplay: false,
    bIsPvP: false,
    bCanPickupOtherGuildDeathPenaltyDrop: false,
    bEnableNonLoginPenalty: false,
    bEnableFastTravel: true,
    bIsStartLocationSelectByMap: true,
    bExistPlayerAfterLogout: false,
    bEnableDefenseOtherGuildPlayer: false,
    CoopPlayerMaxNum: 4,
    ServerPlayerMaxNum: 32,
};

export function ClientSettings() {
    const { isPending, data: ipAddress } = useQuery({
        queryKey: ["palworld", "serverRunning"],
        queryFn: () => isServerRunningAction({}),
    });

    if (isPending) {
        return <div> Loading... </div>;
    }

    if (!ipAddress) {
        return <div> Server needs to be running to make changes. </div>;
    }

    return <RenderClientSettings ipAddress={ipAddress} />;
}

const RenderClientSettings = ({ ipAddress }: { ipAddress: string }) => {
    const { data: clientSettings } = useQuery({
        queryKey: ["palworld", "clientSettings"],
        queryFn: () => getClientSettingsAction({ ipAddress: ipAddress }),
    });

    const defaultValues = {
        ...presetValues,
        ...clientSettings,
    };

    return <ClientSettingsForm defaultValues={defaultValues} />;
};
