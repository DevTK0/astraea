import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";

export function KickAll({ disabled = true }) {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Kick All</Label>
                <div className="text-sm text-muted-foreground">
                    Kicks all players from the server.
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                className="w-[80px]"
                disabled={disabled}
            >
                <Icons.exit />
            </Button>
        </div>
    );
}
