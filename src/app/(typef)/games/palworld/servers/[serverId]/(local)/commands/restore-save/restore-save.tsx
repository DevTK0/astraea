import { Label } from "@/(global)/components/ui/label";
import { RestoreSaveComponent } from "./restore-save.client";

export function RestoreSave() {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Restore Save</Label>
                <div className="text-sm text-muted-foreground">
                    Replaces your current save with a backup.
                </div>
            </div>
            <RestoreSaveComponent />
        </div>
    );
}
