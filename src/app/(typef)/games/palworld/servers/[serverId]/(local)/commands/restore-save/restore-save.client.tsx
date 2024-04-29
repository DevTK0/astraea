"use client";

import { cn } from "@/(global)/lib/css/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/(global)/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/(global)/components/ui/popover";
import { useEffect, useState } from "react";
import { Button } from "@/(global)/components/ui/button";
import { toast, useToast } from "@/(global)/components/ui/use-toast";
import { ScrollArea } from "@/(global)/components/ui/scroll-area";
import { Icons } from "@/(global)/components/ui/icons";

import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";

import { getSavesAction, restoreSaveAction } from "./restore-save.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/(global)/lib/auth/client";
import { z } from "zod";
import { save } from "@/(global)/lib/palworld/rest-api";
import { withErrorHandling } from "@/(global)/lib/error-handling/next-safe-action";

export function RestoreSaveComponent() {
    const { serverId } = useParams<{ serverId: string }>();

    const [comboBoxOpen, setComboBoxOpen] = useState(false);
    const [comboBoxValue, setComboBoxValue] = useState("");
    // const [saves, setSaves] = useState<string[]>([]);
    // const [saveId, setSaveId] = useState<string>("");

    const {
        isError,
        isPending,
        data: saves,
        error,
    } = useQuery({
        queryKey: ["key"],
        queryFn: withErrorHandling(() =>
            getSavesAction({ serverId: parseInt(serverId) })
        ),
    });

    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    }, [isError, error?.message]);

    // const getSavesAction = useAction(getSavesAction, {
    //     onSuccess: (res) => {
    //         setSaveId(res.saveId);
    //         setSaves(res.saves);
    //     },
    //     onError: (err) => {
    //         toast({
    //             variant: "destructive",
    //             title: "Error",
    //             description: err.serverError || "",
    //         });
    //     },
    // });

    // const restoreSaveAction = useAction(restoreSaveAction, {
    //     onSuccess: (res) => {
    //         toast({
    //             title: "Success",
    //             description: res.message,
    //         });
    //     },
    //     onError: (err) => {
    //         toast({
    //             variant: "destructive",
    //             title: "Error",
    //             description:
    //                 err.serverError || JSON.stringify(err.validationErrors),
    //         });
    //     },
    // });

    function handleLoadSaveFiles(open: boolean) {
        setComboBoxOpen(open);

        // if (saves.length == 0) {
        //     if (getSavesAction.status === "executing") return;

        //     getSavesAction.execute({
        //         serverId: parseInt(serverId),
        //         userId: 1,
        //     });
        // }
    }

    return (
        <div className="flex flex-row items-center justify-between ">
            <Popover open={comboBoxOpen} onOpenChange={handleLoadSaveFiles}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboBoxOpen}
                        className="w-[300px] justify-between text-ellipsis overflow-hidden"
                    >
                        {comboBoxValue ? comboBoxValue : "Select Backup Save"}
                        <Icons.caret_sort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Search" className="h-9" />
                        <CommandEmpty>No sav files found.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="max-h-[200px]">
                                {isPending ? (
                                    <div className="ml-2">Loading...</div>
                                ) : (
                                    saves?.saveFiles.map((filename) => (
                                        <CommandItem
                                            key={filename}
                                            value={filename}
                                            onSelect={(currentValue) => {
                                                setComboBoxValue(
                                                    currentValue ===
                                                        comboBoxValue
                                                        ? ""
                                                        : saves.saveFiles.find(
                                                              (savfile) =>
                                                                  savfile.toLowerCase() ===
                                                                  currentValue
                                                          ) ?? ""
                                                );
                                                setComboBoxOpen(false);
                                            }}
                                        >
                                            {filename}
                                            <Icons.check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    comboBoxValue === filename
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
            <RenderRestoreButton
                saveFile={comboBoxValue}
                saveId={saves?.saveId}
            />
        </div>
    );
}

const RenderRestoreButton = ({
    saveFile,
    saveId,
}: {
    saveFile: string;
    saveId: string | undefined;
}) => {
    const action = withErrorHandling(restoreSaveAction);
    const { isError, isPending, mutate, error } = useMutation({
        mutationFn: action,
        onSuccess: (response) => {
            toast({
                title: "Success",
                description: `${response?.message}`,
            });
        },
    });

    function handleRestoreSave() {
        if (isPending || saveId === undefined) return;
        mutate({
            serverId: 1,
            saveFile: saveFile,
            saveId: saveId,
        });
    }

    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    }, [isError, error?.message]);

    return (
        <Button
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={handleRestoreSave}
            disabled={saveId === undefined}
        >
            {isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
                <Icons.upload />
            )}
        </Button>
    );
};
