"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { getSaves } from "./(typef)/games/palworld/servers/[serverId]/(components)/commands/restore-save/get-saves.action";
import { redirect } from "next/navigation";
import { routes } from "@/configs/site";

export default function Home() {
    redirect(routes.landing);

    return <></>;
}
