"use client";
import { usePathname } from "next/navigation";
import { gamelist } from "../meta/gamedata";
import { z } from "zod";

export function usePathSegments() {
    const path = usePathname();
    const game = z.enum(gamelist).parse(path.split("/")[2]);
    const serverId = z.coerce.number().parse(path.split("/")[4]);

    return { game, serverId };
}
