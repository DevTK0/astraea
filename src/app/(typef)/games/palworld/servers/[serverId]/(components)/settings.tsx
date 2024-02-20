import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { ShutdownClient } from "./commands/shutdown-client";
import { KickAll } from "./commands/kick-all";
import { UnbanPlayer } from "./commands/unban-player";
import { BanPlayer } from "./commands/ban-player";
import { Broadcast } from "./commands/broadcast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ServerSettings } from "./configs/server-settings";
import { Icons } from "@/components/ui/icons";

export default function Settings() {
    return (
        <>
            <Collapsible defaultOpen>
                <h3 className="mb-4 text-lg font-semibold">
                    Server Settings
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Icons.caret_sort className="h-4 w-4" />
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
