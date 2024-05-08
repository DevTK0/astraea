"use client";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/(global)/components/ui/form";
import { Button } from "@/(global)/components/ui/button";
import { Switch } from "@/(global)/components/ui/switch";
import { toast } from "@/(global)/components/ui/use-toast";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/(global)/components/ui/select";

import { Icons } from "@/(global)/components/ui/icons";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";

import { setClientSettingsAction } from "./client-settings.action";

export const formSchema = z.object({
    Difficulty: z.string(),
    DayTimeSpeedRate: z.number(),
    NightTimeSpeedRate: z.number(),
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
});

type FormValues = z.infer<typeof formSchema>;

export function ClientSettingsForm({
    defaultValues,
}: {
    defaultValues: Partial<FormValues>;
}) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const action = actionWithErrorHandling(setClientSettingsAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Settings updated.`,
            });
        },
    });

    useError(isError, error);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => mutate(data))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="DayTimeSpeedRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    DayTimeSpeedRate
                                </FormLabel>
                                <FormDescription>
                                    Day time speed
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="NightTimeSpeedRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    NightTimeSpeedRate
                                </FormLabel>
                                <FormDescription>
                                    Night time speed
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PalDamageRateAttack"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PalDamageRateAttack
                                </FormLabel>
                                <FormDescription>
                                    Damage from Pals Multiplier
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PalDamageRateDefense"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PalDamageRateDefense
                                </FormLabel>
                                <FormDescription>
                                    Defense from Pals Multiplier
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PlayerDamageRateAttack"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PlayerDamageRateAttack
                                </FormLabel>
                                <FormDescription>
                                    Damage from Players Multiplier
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PlayerDamageRateDefense"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PlayerDamageRateDefense
                                </FormLabel>
                                <FormDescription>
                                    Defense from Players Multiplier
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PlayerStomachDecreaceRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PlayerStomachDecreaceRate
                                </FormLabel>
                                <FormDescription>
                                    Player Hunger Decrease Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PlayerStaminaDecreaceRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PlayerStaminaDecreaceRate
                                </FormLabel>
                                <FormDescription>
                                    Player Stamina Decrease Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PlayerAutoHPRegeneRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PlayerAutoHPRegeneRate
                                </FormLabel>
                                <FormDescription>
                                    Player Auto HP Regeneration Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PlayerAutoHpRegeneRateInSleep"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PlayerAutoHpRegeneRateInSleep
                                </FormLabel>
                                <FormDescription>
                                    Player Sleep HP Regeneration Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="PalStomachDecreaceRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PalStomachDecreaceRate
                                </FormLabel>
                                <FormDescription>
                                    Pal Hunger Decrease Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PalStaminaDecreaceRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PalStaminaDecreaceRate
                                </FormLabel>
                                <FormDescription>
                                    Pal Stamina Decrease Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PalAutoHPRegeneRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PalAutoHPRegeneRate
                                </FormLabel>
                                <FormDescription>
                                    Pal Auto HP Regeneration Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="PalAutoHpRegeneRateInSleep"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    PalAutoHpRegeneRateInSleep
                                </FormLabel>
                                <FormDescription>
                                    Pal Sleep HP Regeneration Rate
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="BuildObjectDamageRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    BuildObjectDamageRate
                                </FormLabel>
                                <FormDescription>
                                    Damage to Buildings Multiplier
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="BuildObjectDeteriorationDamageRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    BuildObjectDeteriorationDamageRate
                                </FormLabel>
                                <FormDescription>
                                    Building Decay Multiplier (Damage)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="CollectionDropRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    CollectionDropRate
                                </FormLabel>
                                <FormDescription>
                                    Drop Rate of Collection Items (Resources)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="CollectionObjectHpRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    CollectionObjectHpRate
                                </FormLabel>
                                <FormDescription>
                                    Health of Collection Items (Resources)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="CollectionObjectRespawnSpeedRate"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    CollectionObjectRespawnSpeedRate
                                </FormLabel>
                                <FormDescription>
                                    Respawn Speed of Collection Items
                                    (Resources)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="DeathPenalty"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    DeathPenalty
                                </FormLabel>
                                <FormDescription>Death Penalty</FormDescription>
                            </div>
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={field.value}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="None">
                                                None
                                            </SelectItem>
                                            <SelectItem value="Item">
                                                Item
                                            </SelectItem>
                                            <SelectItem value="ItemAndEquipment">
                                                Item, Equipment
                                            </SelectItem>
                                            <SelectItem value="All">
                                                Item, Equipment, Pals
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnablePlayerToPlayerDamage"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnablePlayerToPlayerDamage
                                </FormLabel>
                                <FormDescription>
                                    Enable Player to Player Damage
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableFriendlyFire"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableFriendlyFire
                                </FormLabel>
                                <FormDescription>
                                    Enable Friendly Fire
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableInvaderEnemy"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableInvaderEnemy
                                </FormLabel>
                                <FormDescription>
                                    Enable Invader
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bActiveUNKO"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bActiveUNKO
                                </FormLabel>
                                <FormDescription>Enable UNKO</FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableAimAssistPad"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableAimAssistPad
                                </FormLabel>
                                <FormDescription>
                                    Enable Aim Assist on Pad
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableAimAssistKeyboard"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableAimAssistKeyboard
                                </FormLabel>
                                <FormDescription>
                                    Enable Aim Assist on Keyboard
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="DropItemMaxNum"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    DropItemMaxNum
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Dropped Items (Resources)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="DropItemMaxNum_UNKO"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    DropItemMaxNum_UNKO
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Dropped Items (UNKO)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="BaseCampMaxNum"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    BaseCampMaxNum
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Base Camps Allowed
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="BaseCampWorkerMaxNum"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    BaseCampWorkerMaxNum
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Base Camp Workers Allowed
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="DropItemAliveMaxHours"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    DropItemAliveMaxHours
                                </FormLabel>
                                <FormDescription>
                                    Maximum Time Dropped Items Stay Alive
                                    (Hours)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bAutoResetGuildNoOnlinePlayers"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bAutoResetGuildNoOnlinePlayers
                                </FormLabel>
                                <FormDescription>
                                    Enable auto Reset Guild with no online
                                    players
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="AutoResetGuildTimeNoOnlinePlayers"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    AutoResetGuildTimeNoOnlinePlayers
                                </FormLabel>
                                <FormDescription>
                                    Time to Reset Guild with No Online Players
                                    (Hours)
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="GuildPlayerMaxNum"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    GuildPlayerMaxNum
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Players in a Guild
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bIsMultiplay"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bIsMultiplay
                                </FormLabel>
                                <FormDescription>
                                    Enable Multiplayer Mode
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bIsPvP"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bIsPvP
                                </FormLabel>
                                <FormDescription>
                                    Enable Player vs Player Mode
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bCanPickupOtherGuildDeathPenaltyDrop"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bCanPickupOtherGuildDeathPenaltyDrop
                                </FormLabel>
                                <FormDescription>
                                    Enable Pickup of Other Guild&apos;s Death
                                    Penalty Items
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableNonLoginPenalty"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableNonLoginPenalty
                                </FormLabel>
                                <FormDescription>
                                    Enable Penalty for Not Logging In
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableFastTravel"
                    render={({ field, fieldState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableFastTravel
                                </FormLabel>
                                <FormDescription>
                                    Enable Fast Travel
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bIsStartLocationSelectByMap"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bIsStartLocationSelectByMap
                                </FormLabel>
                                <FormDescription>
                                    Enable Start Location Selection by Map
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bExistPlayerAfterLogout"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bExistPlayerAfterLogout
                                </FormLabel>
                                <FormDescription>
                                    Enable Player Existence After Logout
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bEnableDefenseOtherGuildPlayer"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableDefenseOtherGuildPlayer
                                </FormLabel>
                                <FormDescription>
                                    Enable Defense of Other Guild Players
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="CoopPlayerMaxNum"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    CoopPlayerMaxNum
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Players in a Coop Session
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ServerPlayerMaxNum"
                    render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    ServerPlayerMaxNum
                                </FormLabel>
                                <FormDescription>
                                    Maximum Number of Players in the Server
                                </FormDescription>
                                <FormMessage>
                                    {fieldState.error?.message}
                                </FormMessage>
                            </div>
                            <FormControl></FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit">
                    {isPending ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        "Update Settings"
                    )}
                </Button>
            </form>
        </Form>
    );
}
