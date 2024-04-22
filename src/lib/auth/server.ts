import { Database } from "@/lib/database/server";

function AuthClient() {
    return Database();
}

export async function getUser() {
    const client = AuthClient();

    const {
        data: { user },
    } = await client.auth.getUser();

    return user;
}
