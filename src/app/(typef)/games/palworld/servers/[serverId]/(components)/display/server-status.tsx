import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/css/utils";
import { JSX, ClassAttributes, HTMLAttributes } from "react";

export function ServerStatus(props: ClassAttributes<HTMLDivElement>) {
    const { toast } = useToast();
    const serverStatus = {
        status: "Online",
        instance_type: "r5a.large",
        ip_address: "54.179.250.39",
    };

    return (
        <div {...props}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4">
                <div className="flex flex-row items-start justify-between w-full">
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold">Status</h1>
                        <div className="flex items-center space-x-1">
                            <div
                                className={cn(
                                    "rounded-full border w-3 h-3",
                                    serverStatus.status === "Online"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                )}
                            ></div>
                            <div
                                className={cn(
                                    "text-sm font-medium",
                                    serverStatus.status === "Online"
                                        ? "text-green-500"
                                        : "text-gray-500"
                                )}
                            >
                                {serverStatus.status}
                            </div>
                        </div>
                        {serverStatus.status === "Online" ? (
                            <div>
                                <div className="text-m text-muted-foreground">
                                    {serverStatus.instance_type}
                                </div>
                                <div className="flex items-center space-x-1">
                                    <p className="text-sm">
                                        {serverStatus.ip_address}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                serverStatus.ip_address
                                            );
                                            toast({
                                                description:
                                                    "Copied to clipboard.",
                                            });
                                        }}
                                    >
                                        <Icons.copy />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div
                        className={cn(
                            "rounded-lg border p-4 w-1/2 h-[300px] hidden md:block",
                            serverStatus.status === "Offline" ? "md:hidden" : ""
                        )}
                    ></div>
                </div>
            </div>
        </div>
    );
}
