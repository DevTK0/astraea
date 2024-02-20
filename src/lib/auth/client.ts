import { createBrowserClient } from "@supabase/ssr";
import { z } from "zod";

export function AuthClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function getUser() {
    const client = AuthClient();
    const {
        data: { user },
    } = await client.auth.getUser();

    return user;
}

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type FormValues = z.infer<typeof signInSchema>;

export async function signInWithPassword(values: FormValues) {
    const client = AuthClient();
    const { data, error } = await client.auth.signInWithPassword(values);

    if (error) {
        console.log(error.message);
        return error;
    }
}

export async function signOut() {
    const client = AuthClient();
    const { error } = await client.auth.signOut();

    if (error) {
        console.log(error.message);
    }
}

export async function signInWithDiscord() {
    const client = AuthClient();
    const { data, error } = await client.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: `${getURL()}/auth/callback` },
    });

    if (error) {
        console.log(error.message);
    }
}

const getURL = () => {
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
