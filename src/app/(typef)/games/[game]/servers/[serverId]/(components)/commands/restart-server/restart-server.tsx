import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";

export function RestartServer({ disabled = true }) {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Restart</Label>
                <div className="text-sm text-muted-foreground">
                    Restarts the server.
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                className="w-[80px]"
                disabled={disabled}
            >
                <Icons.reload />
            </Button>
        </div>
    );
}
