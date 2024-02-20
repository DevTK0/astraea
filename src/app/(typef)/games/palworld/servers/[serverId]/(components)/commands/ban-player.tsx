import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BanPlayer({ disabled = true }) {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Unban</Label>
                <div className="text-sm text-muted-foreground">
                    Unbans a player from the server.
                </div>
            </div>
            <Input className="w-[360px]" disabled={disabled} />
        </div>
    );
}
