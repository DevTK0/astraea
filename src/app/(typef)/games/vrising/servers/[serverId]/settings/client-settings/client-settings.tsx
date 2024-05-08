"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/(global)/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/(global)/components/ui/form";
import { Switch } from "@/(global)/components/ui/switch";
import { useError } from "@/(global)/components/error-toast/error-toast";
import { toast } from "@/(global)/components/ui/use-toast";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import { setClientSettingsAction } from "./client-settings.action";
import { useMutation } from "@tanstack/react-query";
import { Icons } from "@/(global)/components/ui/icons";

const formSchema = z.object({
    test: z.boolean(),
});

export function ClientSettings() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            test: true,
        },
    });

    const action = actionWithErrorHandling(setClientSettingsAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `Settings updated.`,
            });
        },
    });

    useError(isError, error);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => mutate(data))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="test"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    bEnableAimAssistPad
                                </FormLabel>
                                <FormDescription>
                                    Enable Aim Assist on Pad
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    {isPending ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        "Update Settings"
                    )}
                </Button>
            </form>
        </Form>
    );
}
