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
                        <StopServer />
                        {/* <RestartServer/> */}
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Separator className="my-4" />
        </>
    );
}
