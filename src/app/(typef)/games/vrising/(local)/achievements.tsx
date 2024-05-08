import { Button } from "@/(global)/components/ui/button";
import { Label } from "@/(global)/components/ui/label";

export function AchievementsDisplay() {
    return (
        <div className="flex flex-col space-y-2 items-start justify-between rounded-lg border p-4 w-[300px]">
            <div>
                <Label className="text-base">Achievements</Label>
            </div>

            <div className=" text-muted-foreground">Achievement 1</div>
            <div className=" text-muted-foreground">Achievement 2</div>
            <div className=" text-muted-foreground">Achievement 3</div>
        </div>
    );
}
