import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { PlayerList } from "./display/player-list";
import { ServerStatus } from "./display/server-status";

export default function Overview() {
    return (
        <>
            <div className="flex flex-row items-start space-x-2">
                <div className="w-full space-y-2 lg:w-3/4">
                    <ServerStatus />
                </div>
                <PlayerList className="hidden w-1/4 lg:block" />
            </div>
        </>
    );
}
