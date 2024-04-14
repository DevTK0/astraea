import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";

import { RestoreSave } from "./commands/restore-save/restore-save";
import { WhitelistIp } from "./commands/whitelist/whitelist-ip";
import { ShutdownClient } from "./commands/shutdown-client";
import { KickAll } from "./commands/kick-all";
import { UnbanPlayer } from "./commands/unban-player";
import { BanPlayer } from "./commands/ban-player";
import { Broadcast } from "./commands/broadcast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";

import { StartServer } from "../../../../[game]/servers/[serverId]/(components)/commands/start-server/start-server";
import { StopServer } from "../../../../[game]/servers/[serverId]/(components)/commands/stop-server/stop-server";
import { RestartServer } from "../../../../[game]/servers/[serverId]/(components)/commands/restart-server/restart-server";
import { UpdateServer } from "./commands/update-server/update";

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
                        {/* <RestartServer disabled={!accessControl.restart} /> */}
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
                        <UpdateServer />
                        {/* <ShutdownClient />
                        <KickAll />
                        <BanPlayer />
                        <UnbanPlayer />
                        <Broadcast /> */}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
