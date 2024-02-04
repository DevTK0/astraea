import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Broadcast({ disabled = true }) {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Broadcast</Label>
                <div className="text-sm text-muted-foreground">
                    Sends a message to the entire server.
                </div>
            </div>
            <Input className="w-[360px]" disabled={disabled} />
        </div>
    );
}
