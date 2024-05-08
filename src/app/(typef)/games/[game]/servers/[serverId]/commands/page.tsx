import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/(global)/components/ui/collapsible";

import { Button } from "@/(global)/components/ui/button";
import { Separator } from "@/(global)/components/ui/separator";
import { Icons } from "@/(global)/components/ui/icons";
import { StartServer } from "./start-server/start-server";
import { StopServer } from "./stop-server/stop-server";
import { RestartServer } from "./restart-server/restart-server";

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
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Commands</h1>
            </div>
            <div className="space-y-4">
                <StartServer />
                <StopServer />
                <RestartServer />
            </div>

            <Separator className="my-4" />
        </main>
    );
}
