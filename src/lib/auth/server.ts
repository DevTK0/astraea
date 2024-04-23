import { routes } from "@/configs/site";
import { Database } from "@/lib/database/server";
import { redirect } from "next/navigation";

function AuthClient() {
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
export async function getSession() {
    const client = AuthClient();

    const session = await client.auth.getSession();

    return session;
}
