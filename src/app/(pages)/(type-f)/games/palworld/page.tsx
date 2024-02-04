"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import Server from "./server/server";
import { Notice } from "./notice/notice";

export default function Palworld() {
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
                <Notice />
                <Separator className="my-4" />
            </TabsContent>
            <TabsContent
                value="server"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
            >
                <Server />
            </TabsContent>
        </Tabs>
    );
}
