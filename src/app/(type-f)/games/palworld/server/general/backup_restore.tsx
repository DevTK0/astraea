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

export function BackupRestore() {
    const [comboBoxOpen, setComboBoxOpen] = useState(false);
    const [comboBoxValue, setComboBoxValue] = useState("");
    const [backupList, setBackupList] = useState<string[]>([]);
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
                setBackupList(res.backupList);
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

    function restoreSave() {
        if (loadingSave) return;
        setLoadingSave(true);

        fetch("/games/palworld/api/restoreSave", {
            method: "POST",
            body: JSON.stringify({ savfile: comboBoxValue }),
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
                setLoadingSave(false);
            })
            .catch((err) => {
                console.log(err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err.message,
                });
                setLoadingSave(false);
            });
    }

    function onComboBoxOpenChange(
        open: boolean | ((prevState: boolean) => boolean)
    ) {
        setComboBoxOpen(open);
        if (backupList.length == 0) getBackupList();
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
                                ? comboBoxValue
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
                                                key={savfile}
                                                value={savfile}
                                                onSelect={(currentValue) => {
                                                    setComboBoxValue(
                                                        currentValue ===
                                                            comboBoxValue
                                                            ? ""
                                                            : backupList.find(
                                                                  (savfile) =>
                                                                      savfile.toLowerCase() ===
                                                                      currentValue
                                                              ) ?? ""
                                                    );
                                                    setComboBoxOpen(false);
                                                }}
                                            >
                                                {savfile}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        comboBoxValue ===
                                                            savfile
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
                <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={restoreSave}
                >
                    {loadingSave ? (
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="animate-spin h-4 w-4"
                        >
                            <path
                                d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    ) : (
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
                    )}
                </Button>
            </div>
        </div>
    );
}
