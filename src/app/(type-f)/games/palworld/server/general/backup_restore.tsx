"use client";

import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

export function BackupRestore() {
    const [comboBoxOpen, setComboBoxOpen] = useState(false);
    const [comboBoxValue, setComboBoxValue] = useState("");
    const [backupList, setBackupList] = useState([{ value: "", lower: "" }]);
    const [loadingBackupList, setLoadingBackupList] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);

    function getBackupList() {
        if (loadingBackupList) return;
        setLoadingBackupList(true);

        fetch("/games/palworld/api/getBackupList")
            .then(async (res) => {
                if (res.ok) return res.json();
                else {
                    const error = await res.json();
                    throw new Error(error.message, { cause: error });
                }
            })
            .then((res) => {
                const list: { value: string; lower: string }[] = [];
                res.backupList.forEach((savfile: string) => {
                    list.push({ lower: savfile.toLowerCase(), value: savfile });
                });
                setBackupList(list);
                setLoadingBackupList(false);
            })
            .catch((err) => {
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err.message,
                });
                setLoadingBackupList(false);
            });
    }

    function onComboBoxOpenChange(
        open: boolean | ((prevState: boolean) => boolean)
    ) {
        setComboBoxOpen(open);
        getBackupList();
    }

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">Restore Save</Label>
                <div className="text-sm text-muted-foreground">
                    Replaces your current save with a backup.
                </div>
            </div>
            <div className="flex flex-row items-center justify-between ">
                <Popover
                    open={comboBoxOpen}
                    onOpenChange={onComboBoxOpenChange}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboBoxOpen}
                            className="w-[300px] justify-between text-ellipsis overflow-hidden"
                        >
                            {comboBoxValue
                                ? backupList.find(
                                      (savfile) =>
                                          savfile.lower === comboBoxValue
                                  )?.value
                                : "Select Backup Save"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search"
                                className="h-9"
                            />
                            <CommandEmpty>No sav files found.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="max-h-[200px]">
                                    {loadingBackupList ? (
                                        <div className="ml-2">Loading...</div>
                                    ) : (
                                        backupList.map((savfile) => (
                                            <CommandItem
                                                key={savfile.value}
                                                value={savfile.lower}
                                                onSelect={(currentValue) => {
                                                    setComboBoxValue(
                                                        currentValue ===
                                                            comboBoxValue
                                                            ? ""
                                                            : currentValue
                                                    );
                                                    setComboBoxOpen(false);
                                                }}
                                            >
                                                {savfile.value}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        comboBoxValue ===
                                                            savfile.lower
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    )}
                                </ScrollArea>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button variant="outline" size="icon" className="ml-2" disabled>
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </Button>
            </div>
        </div>
    );
}
