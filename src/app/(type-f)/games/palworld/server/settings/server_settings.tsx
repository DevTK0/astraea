"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast, useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const schema = z.object({
    type: z.enum(["all", "mentions", "none"], {
        required_error: "You need to select a notification type.",
    }),
    mobile: z.boolean().default(false).optional(),
    communication_emails: z.boolean().default(false).optional(),
    social_emails: z.boolean().default(false).optional(),
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean(),
});

const defaultValues: Partial<FormValues> = {
    communication_emails: false,
    marketing_emails: false,
    social_emails: true,
    security_emails: true,
};

type FormValues = z.infer<typeof schema>;

export function ServerSettings() {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues,
    });
    function onSubmit(data: FormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    const accessControl = {
        pvp: false,
        death_penalty: false,
        exp_rate: false,
        difficulty: false,
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="communication_emails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        PvP
                                        <div className="space-x-2">
                                            <Badge variant="outline">
                                                Admin
                                            </Badge>
                                        </div>
                                    </FormLabel>
                                    <FormDescription>
                                        Player versus player (PvP) mode.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={!accessControl.pvp}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="marketing_emails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        <Label>Death Penalty</Label>
                                        <div className="space-x-2">
                                            <Badge variant="outline">
                                                Admin
                                            </Badge>
                                            <Badge variant="destructive">
                                                Super Admin
                                            </Badge>
                                        </div>
                                    </FormLabel>
                                    <FormDescription>
                                        Enables the penalty upon player death
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={!accessControl.death_penalty}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="social_emails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Exp Rate
                                    </FormLabel>
                                    <FormDescription>
                                        Changes the experience gain rate for
                                        both players and creatures.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Slider
                                        className="w-[360px]"
                                        defaultValue={[5]}
                                        max={100}
                                        step={1}
                                        disabled={!accessControl.exp_rate}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="security_emails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Difficulty
                                    </FormLabel>
                                    <FormDescription>
                                        Adjusts the overall difficulty of the
                                        game.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Select
                                        disabled={!accessControl.difficulty}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="casual">
                                                Casual
                                            </SelectItem>
                                            <SelectItem value="normal">
                                                Normal
                                            </SelectItem>
                                            <SelectItem value="hard">
                                                Hard
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Update Settings</Button>
            </form>
        </Form>
    );
}
