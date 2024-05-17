import { Inngest, NonRetriableError } from "inngest";
import { ZodSchema, z } from "zod";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "astraea" });

export async function expireWithErrorHandling<S extends ZodSchema>(
    event: string,
    data: z.infer<S>,
    schema: S
) {
    const inputs = schema.parse(data);

    await inngest.send({
        name: event,
        data: inputs,
    });
}

export function parseWithErrorHandling<S extends ZodSchema>(
    args: z.infer<S> | any,
    schema: S
): z.infer<S> {
    try {
        return schema.parse(args);
    } catch (e) {
        throw new NonRetriableError("Failed to parse inputs", { cause: e });
    }
}
