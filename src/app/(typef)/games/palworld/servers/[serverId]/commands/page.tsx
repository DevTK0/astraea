import { RestoreSave } from "./restore-save/restore-save";
import { WhitelistIp } from "../../../../[game]/servers/[serverId]/commands/whitelist-ip/whitelist-ip";
import { UpdateClient } from "./update-client/update-client";
import { ShutdownClient } from "./shutdown-client/shutdown-client";
import { Broadcast } from "./broadcast/broadcast";

import { StartServer } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/start-server/start-server";
import { StopServer } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/stop-server/stop-server";
import { RestartServer } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/restart-server/restart-server";

export default function Commands() {
    return (
        <main className="flex flex-1 flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Commands</h1>
            </div>
            <h3 className="text-lg font-semibold">General</h3>
            <div className="space-y-4">
                <WhitelistIp port={8211} />
                <RestoreSave />
                <StartServer />
                <StopServer />
                <RestartServer />
            </div>
            {/* <Separator className="my-4" /> */}
            <h3 className="text-lg font-semibold">Admin</h3>
            <div className="space-y-4">
                <Broadcast />
                <ShutdownClient />
                <UpdateClient />
            </div>
        </main>
    );
}
