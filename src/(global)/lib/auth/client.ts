import { createBrowserClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { z } from "zod";

import { routes } from "@/(global)/configs/site";
import { getURL } from "@/(global)/lib/request/fetch";

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

    if (!user) {
        redirect(routes.signIn);
    }

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

export async function signUpWithPassword(values: FormValues) {
    const client = AuthClient();
    const { data, error } = await client.auth.signUp({
        email: values.email,
        password: values.password,
    });

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
