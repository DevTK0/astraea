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
            if (typeof error === "string") {
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
