import {
    inngest,
    parseWithErrorHandling,
} from "@/(global)/lib/inngest/service";
import { ServiceRole } from "@/(global)/lib/database/service_role";
import { z } from "zod";
import { SupabaseDBError } from "@/(global)/lib/exception/database";
import { safeStop } from "@/(global)/lib/cloud-provider/server";
import {
    addWeekdayTime,
    getNextFreePeriodEnd,
    isFreePeriod,
} from "@/(global)/lib/date/utils";
import { expireWithErrorHandling } from "@/(global)/lib/inngest/service";

const events = {
    weekdayAccess: "weekday-access",
    instanceUpgrade: "instance-upgrade",
};

export const weekendAutostopFn = inngest.createFunction(
    { id: "weekend-autostop" },
    { cron: "TZ=Asia/Singapore 0 2 * * 1" },
    async ({ event, step }) => {
        await step.run("stop-servers", async () => {
            const servers = [1, 2];
            const stopped = [];

            // only stop servers that do not have weekday access
            for (const serverId of servers) {
                const wdAccess = await checkWeekdayAccess(serverId);

                if (wdAccess) continue;

                await safeStop(serverId);
                stopped.push(serverId);
            }

            return { stopped: stopped };
        });
    }
);

async function checkWeekdayAccess(serverId: number) {
    const db = ServiceRole();
    const { data: wdAccess, error } = await db
        .from("server_configs")
        .select(
            `
            config,
            value
            `
        )
        .eq("server_id", serverId)
        .eq("config", "weekday_access")
        .single();

    if (error) throw new SupabaseDBError(error);

    if (!wdAccess.value) return false;

    return wdAccess.value === "true";
}

async function removeWeekdayAccess(serverId: number) {
    const db = ServiceRole();
    const { error } = await db
        .from("server_configs")
        .update({ value: "false" })
        .eq("config", "weekday_access")
        .eq("server_id", serverId);

    if (error) throw new SupabaseDBError(error);
}

const weekdayAutostopSchema = z.object({
    serverId: z.number(),
    days: z.number(),
    userId: z.string(),
});

export async function expireWeekdayAccess(
    serverId: number,
    days: number,
    userId: string
) {
    await expireWithErrorHandling(
        events.weekdayAccess,
        { serverId, days, userId },
        weekdayAutostopSchema
    );
}

export const weekdayAccessAutostopFn = inngest.createFunction(
    { id: "weekday-access-autostop" },
    { event: events.weekdayAccess },
    async ({ event, step }) => {
        const { serverId, days, userId } = parseWithErrorHandling(
            event.data,
            weekdayAutostopSchema
        );

        await step.run("check-weekend", async () => {
            if (isFreePeriod()) {
                const { date: weekday } = getNextFreePeriodEnd();
                await step.sleepUntil("wait-till-weekday", weekday);
            }
        });
        await step.sleepUntil("add-weekday-time", addWeekdayTime(days));
        await step.run("stop-server", async () => {
            await removeWeekdayAccess(serverId);

            if (!isFreePeriod()) {
                await safeStop(serverId);
            }
        });

        return { stopped: serverId, by: userId };
    }
);

export async function expireInstanceUpgrade(
    serverId: number,
    duration: number,
    userId: string
) {
    await expireWithErrorHandling(
        events.instanceUpgrade,
        { serverId, duration, userId },
        instanceUpgradeAutostopSchema
    );
}

const instanceUpgradeAutostopSchema = z.object({
    serverId: z.number(),
    duration: z.number(),
    userId: z.string(),
});

export const instanceUpgradeAutostopFn = inngest.createFunction(
    { id: "instance-upgrade-autostop" },
    { event: events.instanceUpgrade },
    async ({ event, step }) => {
        const { serverId, duration, userId } = parseWithErrorHandling(
            event.data,
            instanceUpgradeAutostopSchema
        );

        await step.sleep("wait-till-expiry", `${duration} hrs`);
        await step.run("revert-instance", async () => {
            await revertInstance(serverId);
            await safeStop(serverId);
        });
    }
);

async function revertInstance(serverId: number) {
    const defaultInstance = "r5a.large";
    const db = ServiceRole();
    const { error } = await db
        .from("server_configs")
        .update({ value: defaultInstance })
        .eq("config", "instance_type")
        .eq("server_id", serverId);

    if (error) throw new SupabaseDBError(error);
}
