import { Label } from "@/(global)/components/ui/label";
import { WhitelistIpComponent } from "./whitelist-ip.client";

export function WhitelistIp({ port }: { port: number }) {
    return (
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 items-start md:items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Whitelist</Label>
                <div className="text-sm text-muted-foreground">
                    Adds your IP address to the list of allowed IPs.
                </div>
            </div>
            <WhitelistIpComponent port={port} />
        </div>
    );
}
