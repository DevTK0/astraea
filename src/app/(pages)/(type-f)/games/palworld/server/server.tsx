"use client";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { BackupRestore } from "./general/backup_restore";
import { WhitelistIp } from "./general/whitelist_ip";
import { StartServer } from "./commands/start-server";
import { StopServer } from "./commands/stop-server";
import { RestartServer } from "./commands/restart-server";
import { ShutdownClient } from "./commands/shutdown-client";
import { KickAll } from "./commands/kick-all";
import { UnbanPlayer } from "./commands/unban-player";
import { BanPlayer } from "./commands/ban-player";
import { Broadcast } from "./commands/broadcast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ServerSettings } from "./settings/server_settings";

export default function Server() {
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
                            <CaretSortIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </h3>
                <CollapsibleContent>
                    <div className="space-y-4">
                        <WhitelistIp disabled={!accessControl.whitelist} />
                        <BackupRestore />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Separator className="my-4" />
            <Collapsible>
                <h3 className="mb-4 text-lg font-semibold">
                    Server Commands
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <CaretSortIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </h3>
                <CollapsibleContent>
                    <div className="space-y-4">
                        <StartServer disabled={!accessControl.start} />
                        <StopServer disabled={!accessControl.stop} />
                        <RestartServer disabled={!accessControl.restart} />
                        <ShutdownClient disabled={!accessControl.shutdown} />
                        <KickAll disabled={!accessControl.kick_all} />
                        <BanPlayer disabled={!accessControl.ban} />
                        <UnbanPlayer disabled={!accessControl.unban} />
                        <Broadcast disabled={!accessControl.broadcast} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Separator className="my-4" />
            <Collapsible>
                <h3 className="mb-4 text-lg font-semibold">
                    Server Settings
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <CaretSortIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </h3>
                <CollapsibleContent>
                    <ServerSettings />
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
