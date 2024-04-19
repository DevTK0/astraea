import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ClientSettings } from "./client-settings/client-settings";
import { Icons } from "@/components/ui/icons";

export default function Settings() {
    return (
        <>
            <Collapsible defaultOpen>
                <h3 className="mb-4 text-lg font-semibold">
                    Settings
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Icons.caret_sort className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </h3>
                <CollapsibleContent>
                    <ClientSettings />
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
