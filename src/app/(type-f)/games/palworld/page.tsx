"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Input } from "@/components/ui/input";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import BackupRestore from "./components/backup_restore";
import WhitelistIp from "./components/whitelist_ip";

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

export default function Palworld() {
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

    // function RconTest() {
    //     fetch("/games/palworld/api/rcon");
    // }

    const accessControl = {
        whitelist: true,
        restore_save: false,

        start: false,
        stop: false,
        restart: false,
        shutdown: false,
        kick_all: false,
        ban: false,
        unban: false,
        broadcast: false,

        pvp: false,
        death_penalty: false,
        exp_rate: false,
        difficulty: false,
    };

    return (
        <Tabs defaultValue="notice" className="h-full space-y-6">
            <div className="space-between flex items-center">
                <TabsList>
                    <TabsTrigger value="notice" className="relative">
                        Notice
                    </TabsTrigger>
                    <TabsTrigger value="server">Server</TabsTrigger>
                    <TabsTrigger value="shop" disabled>
                        Shop
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent
                value="notice"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
            >
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            2 Feb 2024
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Added IP Whitelisting to the server.
                        </p>
                    </div>
                </div>
                <Separator className="my-4" />
            </TabsContent>
            <TabsContent
                value="server"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
            >
                <Collapsible defaultOpen>
                    <h3 className="mb-4 text-lg font-semibold">
                        General
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <CaretSortIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </h3>
                    <CollapsibleContent>
                        <div className="space-y-4">
                            <WhitelistIp disabled={!accessControl.whitelist} />
                            <BackupRestore />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <Separator className="my-4" />
                <Collapsible>
                    <h3 className="mb-4 text-lg font-semibold">
                        Server Commands
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <CaretSortIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </h3>
                    <CollapsibleContent>
                        <div className="space-y-4">
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Start</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Starts the server.
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-[80px]"
                                    disabled={!accessControl.start}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Stop</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Stops the server.
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-[80px]"
                                    disabled={!accessControl.stop}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM12 3H3V12H12V3Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </div>
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
                                    disabled={!accessControl.restart}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">
                                        Shutdown
                                    </Label>
                                    <div className="text-sm text-muted-foreground">
                                        Shutdown the Palworld client on the
                                        server.
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-[80px]"
                                    disabled={!accessControl.shutdown}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            opacity=".05"
                                            d="M6.78296 13.376C8.73904 9.95284 8.73904 5.04719 6.78296 1.62405L7.21708 1.37598C9.261 4.95283 9.261 10.0472 7.21708 13.624L6.78296 13.376Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".1"
                                            d="M7.28204 13.4775C9.23929 9.99523 9.23929 5.00475 7.28204 1.52248L7.71791 1.2775C9.76067 4.9119 9.76067 10.0881 7.71791 13.7225L7.28204 13.4775Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".15"
                                            d="M7.82098 13.5064C9.72502 9.99523 9.72636 5.01411 7.82492 1.50084L8.26465 1.26285C10.2465 4.92466 10.2451 10.085 8.26052 13.7448L7.82098 13.5064Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".2"
                                            d="M8.41284 13.429C10.1952 9.92842 10.1957 5.07537 8.41435 1.57402L8.85999 1.34729C10.7139 4.99113 10.7133 10.0128 8.85841 13.6559L8.41284 13.429Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".25"
                                            d="M9.02441 13.2956C10.6567 9.8379 10.6586 5.17715 9.03005 1.71656L9.48245 1.50366C11.1745 5.09919 11.1726 9.91629 9.47657 13.5091L9.02441 13.2956Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".3"
                                            d="M9.66809 13.0655C11.1097 9.69572 11.1107 5.3121 9.67088 1.94095L10.1307 1.74457C11.6241 5.24121 11.6231 9.76683 10.1278 13.2622L9.66809 13.0655Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".35"
                                            d="M10.331 12.7456C11.5551 9.52073 11.5564 5.49103 10.3347 2.26444L10.8024 2.0874C12.0672 5.42815 12.0659 9.58394 10.7985 12.9231L10.331 12.7456Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".4"
                                            d="M11.0155 12.2986C11.9938 9.29744 11.9948 5.71296 11.0184 2.71067L11.4939 2.55603C12.503 5.6589 12.502 9.35178 11.4909 12.4535L11.0155 12.2986Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".45"
                                            d="M11.7214 11.668C12.4254 9.01303 12.4262 5.99691 11.7237 3.34116L12.2071 3.21329C12.9318 5.95292 12.931 9.05728 12.2047 11.7961L11.7214 11.668Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            opacity=".5"
                                            d="M12.4432 10.752C12.8524 8.63762 12.8523 6.36089 12.4429 4.2466L12.9338 4.15155C13.3553 6.32861 13.3554 8.66985 12.9341 10.847L12.4432 10.752Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 9.1488 1.47969 10.657 2.4767 11.8162L1.64647 12.6464C1.45121 12.8417 1.45121 13.1583 1.64647 13.3535C1.84173 13.5488 2.15832 13.5488 2.35358 13.3535L3.18383 12.5233C4.34302 13.5202 5.8511 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34298 12.5233 3.1838L13.3536 2.35355C13.5488 2.15829 13.5488 1.8417 13.3536 1.64644C13.1583 1.45118 12.8417 1.45118 12.6465 1.64644L11.8162 2.47667C10.657 1.47966 9.14883 0.877045 7.49991 0.877045ZM11.1423 3.15065C10.1568 2.32449 8.88644 1.82704 7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 8.88641 2.32452 10.1568 3.15069 11.1422L11.1423 3.15065ZM3.85781 11.8493C4.84322 12.6753 6.11348 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11345 12.6754 4.84319 11.8493 3.85778L3.85781 11.8493Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">
                                        Kick All
                                    </Label>
                                    <div className="text-sm text-muted-foreground">
                                        Kicks all players from the server.
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-[80px]"
                                    disabled={!accessControl.kick_all}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 15 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z"
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </svg>
                                </Button>
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Ban</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Bans a player from the server.
                                    </div>
                                </div>
                                <Input
                                    className="w-[360px]"
                                    disabled={!accessControl.unban}
                                />
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Unban</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Unbans a player from the server.
                                    </div>
                                </div>
                                <Input
                                    className="w-[360px]"
                                    disabled={!accessControl.unban}
                                />
                            </div>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">
                                        Broadcast
                                    </Label>
                                    <div className="text-sm text-muted-foreground">
                                        Sends a message to the entire server.
                                    </div>
                                </div>
                                <Input
                                    className="w-[360px]"
                                    disabled={!accessControl.unban}
                                />
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <Separator className="my-4" />
                <Collapsible>
                    <h3 className="mb-4 text-lg font-semibold">
                        Server Settings
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <CaretSortIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </h3>
                    <CollapsibleContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
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
                                                        Player versus player
                                                        (PvP) mode.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            !accessControl.pvp
                                                        }
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
                                                        <Label>
                                                            Death Penalty
                                                        </Label>
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
                                                        Enables the penalty upon
                                                        player death
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            !accessControl.death_penalty
                                                        }
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
                                                        Changes the experience
                                                        gain rate for both
                                                        players and creatures.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Slider
                                                        className="w-[360px]"
                                                        defaultValue={[5]}
                                                        max={100}
                                                        step={1}
                                                        disabled={
                                                            !accessControl.exp_rate
                                                        }
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
                                                        Adjusts the overall
                                                        difficulty of the game.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Select
                                                        disabled={
                                                            !accessControl.difficulty
                                                        }
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
                    </CollapsibleContent>
                </Collapsible>
            </TabsContent>
        </Tabs>
    );
}
