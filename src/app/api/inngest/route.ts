import { serve } from "inngest/next";
import { inngest } from "@/(global)/lib/inngest/client";
import {
    weekdayAutostopFn,
    weekendAutostopFn,
} from "@/(global)/services/auto-stop/service";

export const dynamic = "force-dynamic";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [weekendAutostopFn, weekdayAutostopFn],
});
