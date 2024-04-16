import { configs } from "@/configs/servers/palworld";
import { fetchWithErrorHandling } from "../http/fetch";

export async function checkIfClientIsRunning(address: string) {
    try {
        await getServerInfo(address);
    } catch (error) {
        if (
            error instanceof TypeError &&
            error.cause instanceof Error &&
            error.cause.message.includes("ECONNREFUSED")
        ) {
            return false;
        }
    }

    return true;
}

export async function getServerInfo(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/info`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export type Player = {
    name: string;
    playerid: string;
    userid: string;
    ip: string;
    ping: number;
    location_x: number;
    location_y: number;
    level: number;
};

export async function getPlayerList(address: string): Promise<Player[]> {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/players`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export async function getServerSettings(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/settings`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export async function getServerMetrics(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/metrics`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export async function announceMessage(address: string, message: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/announce`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
            body: JSON.stringify({ message: message }),
        }
    );
}

export async function kickPlayer(
    address: string,
    userId: string,
    message: string
) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/kick`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
            body: JSON.stringify({ userId: userId, message: message }),
        }
    );
}

export async function banPlayer(
    address: string,
    userId: string,
    reason: string
) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/ban`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
                body: JSON.stringify({ userid: userId, message: reason }),
            },
        }
    );
}

export async function unbanPlayer(
    address: string,
    userId: string,
    reason: string
) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/unban`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
                body: JSON.stringify({ userId: userId, message: reason }),
            },
        }
    );
}

export async function save(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/save`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}

export async function shutdown(address: string, wait: number, message: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/shutdown`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
            body: JSON.stringify({ waitTime: wait, message: message }),
        }
    );
}

export async function forceStop(address: string) {
    return await fetchWithErrorHandling(
        `http://${address}:${configs.apiPort}/v1/api/stop`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
                Authorization: `Basic ${process.env.PALWORLD_API_AUTH_HEADER}`,
            },
        }
    );
}
