"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/(global)/components/ui/tabs";
import { Separator } from "@/(global)/components/ui/separator";

import Commands from "./(local)/commands/commands";
import Settings from "./(local)/settings/settings";
import Overview from "./(local)/overview/overview";

export default function Server() {
    return (
        <Tabs defaultValue="overview" className="h-full space-y-6">
            <div className="space-between flex items-center">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commands">Commands</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="shop" disabled>
                        Shop
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent
                value="overview"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
            >
                <Overview />
                <Separator className="my-4" />
            </TabsContent>
            <TabsContent
                value="commands"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
            >
                <Commands />
            </TabsContent>
            <TabsContent
                value="settings"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
            >
                <Settings />
            </TabsContent>
        </Tabs>
    );
}
