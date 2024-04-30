import { SafeAction, createSafeActionClient } from "next-safe-action";
import { ZodError, type ZodSchema, type z } from "zod";
import { ServerError, ValidationError } from "../exception/next-safe-action";

export function actionWithErrorHandling<S extends ZodSchema, Data>(
    action: SafeAction<S, Data>
): (input: z.infer<S>) => Promise<Data | undefined> {
    return async function (params) {
        const { data, serverError, validationErrors } = await action(params);

        if (serverError) {
            throw new ServerError(serverError);
        }

        for (const error in validationErrors) {
            throw new ValidationError("Invalid " + error);
        }

        return data;
    };
}

export const action = createSafeActionClient({
    handleReturnedServerError(err) {
        console.log(err);
        if (err instanceof ZodError) {
            // return first error message
            return err.issues[0].message;
        }
        return err.message;
    },
    async middleware() {
        // To Do:
        // Add auth features
    },
});
