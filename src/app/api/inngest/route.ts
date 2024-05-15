import { serve } from "inngest/next";
import { inngest } from "@/(global)/lib/inngest/service";
import {
    instanceUpgradeAutostopFn,
    weekdayAccessAutostopFn,
    weekendAutostopFn,
} from "@/(global)/services/auto-stop/service";

export const dynamic = "force-dynamic";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        weekendAutostopFn,
        weekdayAccessAutostopFn,
        instanceUpgradeAutostopFn,
    ],
});
