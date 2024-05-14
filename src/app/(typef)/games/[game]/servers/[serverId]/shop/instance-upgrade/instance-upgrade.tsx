"use client";
import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { Label } from "@/(global)/components/ui/label";
import { SelectTrigger } from "@/(global)/components/ui/select";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectValue,
} from "@/(global)/components/ui/select";

export function InstanceUpgrade() {
    const isPending = false;
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Instance Upgrade</Label>
                <div className="text-sm text-muted-foreground">
                    Upgrades the server instance to a higher tier.
                </div>
            </div>

            <div className="flex flex-row space-x-2 w-[300px]">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Instance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="1">large</SelectItem>
                            <SelectItem value="2">xlarge</SelectItem>
                            <SelectItem value="3">2xlarge</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button
                    variant="secondary"
                    size="sm"
                    className="flex flex-row items-center space-x-1 text-amber-400"
                    // disabled={true}
                    onClick={() => console.log("Weekday access")}
                >
                    {isPending ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Icons.coin />
                            <span className="text-base"> 0 </span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
