import { inngest } from "@/(global)/lib/inngest/client";
import { ServiceRole } from "@/(global)/lib/database/service_role";
import { z } from "zod";
import { SupabaseDBError } from "@/(global)/lib/exception/database";
import { stopServer } from "@/(global)/lib/cloud-provider/server";
import {
    addWeekdayTime,
    getNextWeekday,
    isWeekend,
} from "@/(global)/lib/date/utils";

const weekendAutostopSchema = z.object({
    servers: z.number().array(),
});

async function weekendAutostopAction({
    servers,
}: z.infer<typeof weekendAutostopSchema>) {
    const stopped = [];

    for (const serverId of servers) {
        const wdAccess = await checkWeekdayAccess(serverId);

        if (wdAccess) continue;

        try {
            await stopServer(serverId);
            stopped.push(serverId);
        } catch {}
    }

    return stopped;
}

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

export async function registerAutostop(serverId: number, days: number) {
    await inngest.send({
        name: "weekday-autostop",
        data: {
            serverId,
            days,
        },
    });
}

export const weekendAutostopFn = inngest.createFunction(
    { id: "weekend-autostop" },
    { cron: "TZ=Asia/Singapore 0 2 * * 1" },
    async ({ event, step }) => {
        const servers = await weekendAutostopAction({ servers: [1, 2] });

        return { stopped: servers };
    }
);

export const weekdayAutostopFn = inngest.createFunction(
    { id: "weekday-autostop" },
    { event: "weekday-autostop" },
    async ({ event, step }) => {
        const { serverId, days } = event.data;

        if (isWeekend()) {
            const { date: weekday } = getNextWeekday();
            await step.sleepUntil("wait-till-weekday", weekday);
        }

        await step.sleepUntil("add-weekday-time", addWeekdayTime(days));
        await step.run("stop-server", async () => {
            await removeWeekdayAccess(serverId);

            if (!isWeekend()) {
                try {
                    await stopServer(serverId);
                } catch {}
            }
        });

        return { stopped: serverId };
    }
);
