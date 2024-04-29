import { ServerStatus } from "../../../../../[game]/servers/[serverId]/(local)/overview/server-status/server-status";
import { ClientStatus } from "./client-status/client-status";
import { PlayerList } from "./player-list/player-list";

export default function Overview() {
    return (
        <>
            <div className="flex flex-row items-start space-x-2">
                <div className="w-full space-y-2 lg:w-3/4">
                    <ServerStatus />
                    <ClientStatus />
                </div>
                <PlayerList className="hidden w-1/4 lg:block" />
            </div>
        </>
    );
}
