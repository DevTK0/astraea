"use client";

import { useError } from "@/(global)/components/error-toast/error-toast";
import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/(global)/components/ui/select";
import { toast } from "@/(global)/components/ui/use-toast";
import { usePathSegments } from "@/(global)/hooks/path";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useMutation } from "@tanstack/react-query";
import { weekdayAccessAction } from "./weekday-access.action";
import { useState } from "react";

export function ClientComponent() {
    const { serverId } = usePathSegments();
    const [days, setDays] = useState<number>(0);

    const action = actionWithErrorHandling(weekdayAccessAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Purchased weekday access for ${days} days.`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-row space-x-2 w-[300px]">
            <Select onValueChange={(value: string) => setDays(parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="No. Days" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button
                variant="secondary"
                size="sm"
                className="flex flex-row items-center space-x-1 text-amber-400"
                onClick={() => mutate({ serverId, days })}
                disabled={days === 0}
            >
                {isPending ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Icons.coin className="" />
                        <span className="text-base"> {100 * days}</span>
                    </>
                )}
            </Button>
        </div>
    );
}
