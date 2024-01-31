"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Game } from "../games/gamelist";

interface GamePortraitProps extends React.HTMLAttributes<HTMLDivElement> {
    game: Game;
    width?: number;
    height?: number;
}

export function GamePortrait({
    game: game,
    width,
    height,
    className,
    ...props
}: GamePortraitProps) {
    return (
        <div className={cn("space-y-3", className)} {...props}>
            <div className="overflow-hidden rounded-md">
                <Image
                    src={game.thumbnail}
                    alt={game.name}
                    width={width}
                    height={height}
                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-[3/4]"
                />
            </div>
        </div>
    );
}
