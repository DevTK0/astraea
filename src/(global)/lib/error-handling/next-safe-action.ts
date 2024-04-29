import { SafeAction } from "next-safe-action";
import type { ZodSchema, z } from "zod";

export function withErrorHandling<S extends ZodSchema, Data>(
    action: SafeAction<S, Data>
): (input: z.infer<S>) => Promise<Data | undefined> {
    return async function (params) {
        const { data, serverError, validationErrors } = await action(params);

        if (serverError) {
            // console.log(serverError);
            throw new ServerError(serverError);
        }

        for (const error in validationErrors) {
            // console.log("Invalid " + error);
            throw new ValidationError("Invalid " + error);
        }

        return data;
    };
}

export class ServerError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

// import { SafeAction } from "next-safe-action";
// import type { ZodSchema, z } from "zod";

// export function withErrorHandling<S extends ZodSchema, Data>(
//     action: SafeAction<S, Data>
// ): (input: z.infer<S>) => Promise<SafeActionResponse<Data> | undefined> {
//     return async function (params) {
//         const { data, serverError, validationErrors } = await action(params);

//         if (serverError) {
//             return {
//                 status: "error",
//                 error: serverError,
//             };
//             // throw new ServerError(serverError);
//         }

//         for (const error in validationErrors) {
//             // throw new ValidationError("Invalid " + error);
//             // return first error
//             return {
//                 status: "error",
//                 error: "Invalid " + error,
//             };
//         }

//         return {
//             status: "success",
//             data: data,
//         };
//     };
// }

// export type SafeActionResponse<Data> =
//     | { status: "error"; error: string }
//     | { status: "success"; data: Data | undefined };

// export class ServerError extends Error {
//     constructor(message: string) {
//         super(message);
//     }
// }

// export class ValidationError extends Error {
//     constructor(message: string) {
//         super(message);
//     }
// }
