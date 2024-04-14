import { getInstanceState } from "./aws/ec2";

export type ServerStatus =
    | "Starting"
    | "Running"
    | "Stopping"
    | "Stopped"
    | "Archived";

export function getServerStatus(
    game: string,
    serverId: number
): {
    status: ServerStatus;
    ipAddress?: string;
    instanceType?: string;
} {
    return {
        status: "Starting",
        instanceType: "test",
    };
    // return getInstanceState(game, serverId);
}
