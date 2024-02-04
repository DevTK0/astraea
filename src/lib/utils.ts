import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
};

import { NextRequest } from "next/server";

export function withErrorHandling(
    handler: (req: NextRequest) => Promise<Response>
) {
    return async function (req: NextRequest) {
        try {
            return await handler(req);
        } catch (error) {
            if (error instanceof HTTPError) {
                const httpError = error as HTTPError;
                console.log(httpError.message);
                return new Response(
                    JSON.stringify({ message: httpError.message }),
                    {
                        status: httpError.status,
                    }
                );
            } else if (typeof error === "string") {
                console.log(error);
                return new Response(JSON.stringify({ message: error }), {
                    status: 500,
                });
            } else if (error instanceof Error) {
                console.log(error.message);
                return new Response(
                    JSON.stringify({ message: error.message }),
                    {
                        status: 500,
                    }
                );
            }
        }
    };
}

export interface HTTPError extends Error {
    status: number;
    cause: unknown;
}

export function HTTPError(
    message: string,
    statusCode: number,
    error?: Error
): HTTPError {
    const httpError = new Error(message) as HTTPError;

    httpError.status = statusCode;

    if (error) {
        if (error instanceof Error) {
            httpError.stack = error.stack;
        }
        if ("cause" in error) {
            httpError.cause = error.cause;
        }
    }

    return httpError;
}
