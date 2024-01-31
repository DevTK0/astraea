"use client";

import { redirect, usePathname, useRouter } from "next/navigation";

export default function Home() {
    const path = usePathname();

    if (path === "/") {
        redirect("/games");
    }

    return <></>;
}
