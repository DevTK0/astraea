import { routes } from "@/(global)/configs/site";
import { Database } from "@/(global)/lib/database/actions";
import { redirect } from "next/navigation";

export function AuthClient() {
    return Database();
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

export async function exchangeCodeForSession(code: string) {
    const client = AuthClient();
    return await client.auth.exchangeCodeForSession(code);
}
