"use client";

import { JSX, ClassAttributes, HTMLAttributes, useEffect } from "react";
import { getPlayerListAction } from "./player-list.action";
import { useQuery } from "@tanstack/react-query";
import { playerListSchema } from "@/(global)/services/palworld/rest-api";
import { actionWithErrorHandling } from "@/(global)/lib/request/next-safe-action";
import z from "zod";
import { usePathSegments } from "@/(global)/hooks/path";

type Players = z.infer<typeof playerListSchema>;

export function PlayerList(
    props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement>
) {
    const { game, serverId } = usePathSegments();

    const {
        isError,
        isPending,
        data: playerList,
        error,
    } = useQuery({
        queryKey: ["palworld", "online-players"],
        queryFn: actionWithErrorHandling(() =>
            getPlayerListAction({ game, serverId })
        ),
    });

    return (
        <div {...props}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                <h1 className="text-xl font-semibold">
                    Online ({playerList?.length ?? 0})
                </h1>
                <RenderOnlinePlayers
                    isError={isError}
                    isPending={isPending}
                    error={error}
                    playerList={playerList}
                />
            </div>
        </div>
    );
}

const RenderOnlinePlayers = ({
    isPending,
    isError,
    playerList,
    error,
}: {
    isPending: boolean;
    isError: boolean;
    playerList: Players | readonly [] | undefined;
    error: Error | null;
}) => {
    if (isPending) {
        return <div> Loading...</div>;
    }

    if (isError) {
        return <div className="text-red-500"> Error: {error?.message}</div>;
    }

    if (playerList?.length == 0) {
        return <div> No players online. </div>;
    }

    return playerList?.map((player) => (
        <div
            key={player.name}
            className="flex flex-row items-center justify-start space-x-2"
        >
            <div>{player.name}</div>
        </div>
    ));
};
