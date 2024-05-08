import { Button } from "@/(global)/components/ui/button";
import { Label } from "@/(global)/components/ui/label";
import Link from "next/link";

export function ServerDisplay() {
    return (
        <div className="flex flex-col justify-between rounded-lg border p-4 space-y-2">
            <Label className="text-base">Servers</Label>
            <div className="flex flex-row items-center justify-between w-full">
                <div className=" text-muted-foreground">
                    <Link href="/games/vrising/servers/2">Astraea Server</Link>
                </div>
                <Button size="sm" variant="default">
                    Join
                </Button>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
                <div className="text-muted-foreground">Server 2</div>
                <Button size="sm" variant="secondary">
                    Leave
                </Button>
            </div>
        </div>
    );
}
