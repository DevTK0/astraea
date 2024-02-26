"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import Commands from "./(components)/commands";
// import Settings from "./(components)/settings";
import Overview from "./(components)/overview";

export default function Game() {
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
            ></TabsContent>
        </Tabs>
    );
}
