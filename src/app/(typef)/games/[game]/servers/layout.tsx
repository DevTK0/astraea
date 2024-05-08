import { Breadcrumb } from "@/(global)/components/ui/breadcrumb";
import { Button } from "@/(global)/components/ui/button";
import Link from "next/link";

export default function GamesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                            {/* <Bell className="h-4 w-4" /> */}
                            <span className="sr-only">
                                Toggle notifications
                            </span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="#"
                                className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2 text-primary  transition-all hover:text-primary"
                            >
                                {/* <Home className="h-4 w-4" /> */}
                                Overview
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                {/* <ShoppingCart className="h-4 w-4" /> */}
                                Commands
                                {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            6
                        </Badge> */}
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                {/* <Package className="h-4 w-4" /> */}
                                Settings
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                {/* <Users className="h-4 w-4" /> */}
                                Shop
                            </Link>
                        </nav>
                    </div>
                    {/* </div> */}
                </div>
            </div>
            <div className="w-full flex-1 h-full px-4 py-6 space-y-4 lg:px-8 ">
                {/* <Breadcrumb /> */}
                {children}
                {/* <div className="flex flex-1">{children}</div> */}
            </div>
        </div>
    );
}
