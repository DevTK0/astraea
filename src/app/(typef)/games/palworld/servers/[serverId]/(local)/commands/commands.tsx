import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/(global)/components/ui/collapsible";
import { Button } from "@/(global)/components/ui/button";
import { Separator } from "@/(global)/components/ui/separator";
import { Icons } from "@/(global)/components/ui/icons";

import { StartServer } from "../../../../../[game]/servers/[serverId]/(local)/commands/start-server/start-server";
import { StopServer } from "../../../../../[game]/servers/[serverId]/(local)/commands/stop-server/stop-server";
import { RestartServer } from "../../../../../[game]/servers/[serverId]/(local)/commands/restart-server/restart-server";

import { RestoreSave } from "./restore-save/restore-save";
import { WhitelistIp } from "./whitelist-ip/whitelist-ip";
import { UpdateClient } from "./update-client/update-client";
import { ShutdownClient } from "./shutdown-client/shutdown-client";
import { Broadcast } from "./broadcast/broadcast";

export default function Commands() {
    const accessControl = {
        whitelist: true,
        restore_save: false,

        start: false,
        stop: false,
        restart: false,
        shutdown: false,
        kick_all: false,
        ban: false,
        unban: false,
        broadcast: false,
    };

    return (
        <>
            <Collapsible defaultOpen>
                <h3 className="mb-4 text-lg font-semibold">
                    General
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Icons.caret_sort className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </h3>
                <CollapsibleContent>
                    <div className="space-y-4">
                        <WhitelistIp />
                        <RestoreSave />
                        <StartServer />
                        <StopServer />
                        <RestartServer />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Separator className="my-4" />
            <Collapsible defaultOpen>
                <h3 className="mb-4 text-lg font-semibold">
                    Admin
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Icons.caret_sort className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </h3>
                <CollapsibleContent>
                    <div className="space-y-4">
                        <Broadcast />
                        <ShutdownClient />
                        <UpdateClient />
                        {/* 
                        <KickAll />
                        <BanPlayer />
                        <UnbanPlayer />
                         */}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
