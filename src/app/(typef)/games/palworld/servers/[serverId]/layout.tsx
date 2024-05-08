"use client";

import { Button } from "@/(global)/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/(global)/lib/css/utils";

export default function GamesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();

    // remove everything after the last slash
    const basePath = path.substring(0, path.lastIndexOf("/"));
    const route = path.substring(path.lastIndexOf("/") + 1);

    console.log(route);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                {/* <div className="flex h-full px-4 py-6 space-y-4 lg:px-8 md:block"> */}
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold"
                        >
                            {/* <Package2 className="h-6 w-6" /> */}
                            <span className="">Astraea Palworld</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto h-8 w-8"
                        >
                            <span className="sr-only">
                                Toggle notifications
                            </span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href={`${basePath}/overview`}
                                className={cn(
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-primary  transition-all hover:text-primary`,
                                    route === "overview"
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                Overview
                            </Link>
                            <Link
                                href={`${basePath}/commands`}
                                className={cn(
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-primary  transition-all hover:text-primary`,
                                    route === "commands"
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                Commands
                            </Link>
                            <Link
                                href={`${basePath}/settings`}
                                className={cn(
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-primary  transition-all hover:text-primary`,
                                    route === "settings"
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                Settings
                            </Link>
                            <Link
                                href={`${basePath}/shop`}
                                className={cn(
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-primary  transition-all hover:text-primary`,
                                    route === "shop"
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                Shop
                            </Link>
                        </nav>
                    </div>
                    {/* </div> */}
                </div>
            </div>
            <div className="w-full flex-1 h-full px-4 py-6 space-y-4 lg:px-8 ">
                {children}
            </div>
        </div>
    );
}
