"use client";

import { redirect, usePathname } from "next/navigation";

export default function Home() {
    const path = usePathname();

    if (path === "/") {
        redirect("/games");
    }

    return <></>;
}
