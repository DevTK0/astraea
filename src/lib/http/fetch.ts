import { HTTPError } from "@/lib/error-handling/http";

export async function fetchWithErrorHandling(
    url: string,
    options?: RequestInit
) {
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
}
