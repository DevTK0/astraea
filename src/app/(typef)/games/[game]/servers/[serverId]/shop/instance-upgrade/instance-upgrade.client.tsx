"use client";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { Button } from "@/(global)/components/ui/button";
import { Icons } from "@/(global)/components/ui/icons";
import { SelectTrigger } from "@/(global)/components/ui/select";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@/(global)/components/ui/select";
import { toast } from "@/(global)/components/ui/use-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { instanceUpgradeAction } from "./instance-upgrade.action";
import { usePathSegments } from "@/(global)/hooks/path";
import { InstanceType } from "@/(global)/lib/cloud-provider/aws/ec2";
import { set } from "zod";

// ordered from lowest to highest
const allowedInstances = [
    { label: "r5a.large (default)", value: "r5a.large" },
    { label: "r5a.xlarge (2x)", value: "r5a.xlarge" },
    { label: "r5a.2xlarge (4x)", value: "r5a.2xlarge" },
];

export function ClientComponent({
    currentInstance,
    instanceCosts,
}: {
    currentInstance: InstanceType;
    instanceCosts: Record<string, number>;
}) {
    const { serverId } = usePathSegments();
    const [instance, setInstance] = useState<InstanceType>(currentInstance);

    const currentIndex = allowedInstances.findIndex(
        (instance) => instance.value === currentInstance
    );
    const availableInstances = allowedInstances.slice(currentIndex);

    const action = actionWithErrorHandling(instanceUpgradeAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Instance upgraded to ${instance}`,
            });
        },
    });

    useError(isError, error);

    return (
        <div className="flex flex-row space-x-2 w-[300px]">
            <Select
                onValueChange={(value: InstanceType) => setInstance(value)}
                defaultValue={instance}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Instance" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {availableInstances.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button
                variant="secondary"
                size="sm"
                className="flex flex-row items-center space-x-1 text-amber-400"
                disabled={instance === currentInstance}
                onClick={() => mutate({ serverId, instanceType: instance })}
            >
                {isPending ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Icons.coin />
                        <span className="text-base">
                            {instanceCosts[instance] -
                                instanceCosts[currentInstance]}
                        </span>
                    </>
                )}
            </Button>
        </div>
    );
}
