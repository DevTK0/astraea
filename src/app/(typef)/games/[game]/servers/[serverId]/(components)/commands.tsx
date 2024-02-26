import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { StartServer } from "./commands/start-server/start-server";
import { StopServer } from "./commands/stop-server/stop-server";
import { RestartServer } from "./commands/restart-server/restart-server";

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
                        <StartServer />
                        <StopServer disabled={!accessControl.stop} />
                        <RestartServer disabled={!accessControl.restart} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Separator className="my-4" />
        </>
    );
}
