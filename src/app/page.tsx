"use client";

import { useAction } from "next-safe-action/hooks";
import { users2 } from "./actions";
import { useEffect } from "react";
import { getSaves } from "./(typef)/games/palworld/servers/[serverId]/(components)/commands/restore-save/get-saves.action";
import { redirect } from "next/navigation";
import { routes } from "@/configs/site";

export default function Home() {
    const { execute, result } = useAction(getSaves);

    useEffect(() => {
        execute({
            serverId: 1,
            userId: 1,
        });
    }, []);

    // redirect(routes.landing);

    return (
        <div>
            {/* {result.data?.map((item, i) => {
                return <div key={i}>{item.users?.ip_address} </div>;
            })} */}
            {JSON.stringify(result.data)}
        </div>
    );
}
