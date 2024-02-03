"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export function WhitelistIp({ disabled = true }) {
    const [ip, setIp] = useState("searching...");

    useEffect(() => {
        fetch("/users/getIP")
            .then((res) => res.json())
            .then((res) => {
                setIp(res);
            });
    }, []);

    function whitelistIP() {
        fetch("/games/palworld/api/whitelistIP", {
            method: "POST",
        })
            .then(async (res) => {
                if (res.ok) return res.json();
                else {
                    const error = await res.json();
                    throw new Error(error.message, { cause: error });
                }
            })
            .then((res) => {
                toast({
                    title: "Success",
                    description: res.message,
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err.message,
                });
            });
    }

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">
                    Whitelist
                    <span className="text-sm text-muted-foreground pl-2">
                        {ip}
                    </span>
                </Label>
                <div className="text-sm text-muted-foreground">
                    Adds your IP address to the list of allowed IPs.
                </div>
            </div>
            <Button
                variant="default"
                size="sm"
                className="w-[80px]"
                disabled={disabled}
                onClick={whitelistIP}
            >
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </Button>
        </div>
    );
}
