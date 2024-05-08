import Image from "next/image";

import { vrising as game } from "@/(global)/meta/gamedata";
import { Label } from "@/(global)/components/ui/label";
import { Button } from "@/(global)/components/ui/button";
import { ServerDisplay } from "./servers/(shared)/server-display";
import { AchievementsDisplay } from "./(local)/achievements";

export default function VRising() {
    return (
        <>
            <h1 className="text-5xl">{game.name}</h1>
            {/* <Image
                src={game.banner}
                alt={game.name}
                width={1000}
                height={100}
                className="rounded-lg mb-5 w-full h-auto"
            /> */}
            <div className="grid grid-cols-2 grid-flow-row gap-4">
                <ServerDisplay />

                {/* <AchievementsDisplay /> */}
            </div>
        </>
    );
}
