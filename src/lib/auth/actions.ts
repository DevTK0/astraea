import { Database } from "@/lib/database/actions";

export function AuthClient() {
    return Database();
}

export async function getUser() {
    const client = AuthClient();
    const {
        data: { user },
    } = await client.auth.getUser();

    return user;
}

export async function exchangeCodeForSession(code: string) {
    const client = AuthClient();
    return await client.auth.exchangeCodeForSession(code);
}
