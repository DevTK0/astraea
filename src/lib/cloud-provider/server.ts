import { getInstanceState } from "./aws/ec2";

export type ServerStatus =
    | "Starting"
    | "Running"
    | "Stopping"
    | "Stopped"
    | "Archived";

export function getServerStatus(game: string, serverId: number) {
    return getInstanceState(game, serverId);
}
