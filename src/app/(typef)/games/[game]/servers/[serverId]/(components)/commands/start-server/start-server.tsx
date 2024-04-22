import { Label } from "@/components/ui/label";
import { StartServerButton } from "./start-server.client";

export function StartServer() {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Start</Label>
                <div className="text-sm text-muted-foreground">
                    Starts the server.
                </div>
            </div>
            <StartServerButton />
        </div>
    );
}
