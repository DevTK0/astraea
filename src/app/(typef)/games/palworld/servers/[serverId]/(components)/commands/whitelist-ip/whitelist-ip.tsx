import { Label } from "@/components/ui/label";
import { WhitelistIpComponent } from "./whitelist-ip.client";

export function WhitelistIp() {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Whitelist</Label>
                <div className="text-sm text-muted-foreground">
                    Adds your IP address to the list of allowed IPs.
                </div>
            </div>
            <WhitelistIpComponent />
        </div>
    );
}
