import { HTTPError } from "@/(global)/lib/exception/http";

export async function fetchWithErrorHandling(
    url: string,
    options?: RequestInit
) {
    try {
        const response = await fetch(url, options);

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            const data = contentType?.includes("application/json")
                ? response.json()
                : response.text();

            return data;
        } else {
            throw new HTTPError(response.statusText, response.status);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getURL = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "local";

    let url: string | undefined =
        env == "production"
            ? process?.env?.NEXT_PUBLIC_SITE_URL // Vercel production env.
            : env == "preview"
            ? process?.env?.NEXT_PUBLIC_VERCEL_BRANCH_URL // Vercel branch env.
            : undefined;

    url = url ?? "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
};
