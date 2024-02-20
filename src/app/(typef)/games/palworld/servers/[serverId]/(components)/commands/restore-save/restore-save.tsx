"use client";

import { cn } from "@/lib/css/utils";
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
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/ui/icons";

import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";

import { getSaves } from "./get-saves.action";
import { restoreSave } from "./restore-save.action";

export function RestoreSave() {
    const { serverId } = useParams<{ serverId: string }>();

    const [comboBoxOpen, setComboBoxOpen] = useState(false);
    const [comboBoxValue, setComboBoxValue] = useState("");
    const [saves, setSaves] = useState<string[]>([]);
    const [saveId, setSaveId] = useState<string>("");

    const getSavesAction = useAction(getSaves, {
        onSuccess: (res) => {
            setSaveId(res.saveId);
            setSaves(res.saves);
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.serverError || "",
            });
        },
    });

    const restoreSaveAction = useAction(restoreSave, {
        onSuccess: (res) => {
            toast({
                title: "Success",
                description: res.message,
            });
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    err.serverError || JSON.stringify(err.validationErrors),
            });
        },
    });

    function handleRestoreSave() {
        if (restoreSaveAction.status === "executing") return;
        restoreSaveAction.execute({
            serverId: parseInt(serverId),
            saveFile: comboBoxValue,
            saveId: saveId,
        });
    }

    function handleLoadSaveFiles(open: boolean) {
        setComboBoxOpen(open);
        if (saves.length == 0) {
            if (getSavesAction.status === "executing") return;

            getSavesAction.execute({
                serverId: parseInt(serverId),
                userId: 1,
            });
        }
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
                <Popover open={comboBoxOpen} onOpenChange={handleLoadSaveFiles}>
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
                            <Icons.caret_sort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                    {getSavesAction.status === "executing" &&
                                    saves.length == 0 ? (
                                        <div className="ml-2">Loading...</div>
                                    ) : (
                                        saves.map((savfile) => (
                                            <CommandItem
                                                key={savfile}
                                                value={savfile}
                                                onSelect={(currentValue) => {
                                                    setComboBoxValue(
                                                        currentValue ===
                                                            comboBoxValue
                                                            ? ""
                                                            : saves.find(
                                                                  (savfile) =>
                                                                      savfile.toLowerCase() ===
                                                                      currentValue
                                                              ) ?? ""
                                                    );
                                                    setComboBoxOpen(false);
                                                }}
                                            >
                                                {savfile}
                                                <Icons.check
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
                    onClick={handleRestoreSave}
                >
                    {restoreSaveAction.status === "executing" ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.paper_plane />
                    )}
                </Button>
            </div>
        </div>
    );
}
