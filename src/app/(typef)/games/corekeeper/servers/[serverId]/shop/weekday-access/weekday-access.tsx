import { Label } from "@/(global)/components/ui/label";
import { ClientComponent } from "./weekday-access.client";

export function WeekdayAccess() {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Weekday Access</Label>
                <div className="text-sm text-muted-foreground">
                    Unlocks weekday access for everyone on this server.
                </div>
            </div>
            <ClientComponent />
        </div>
    );
}
