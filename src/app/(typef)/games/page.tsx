import { ClassAttributes, HTMLAttributes } from "react";
import Sidebar from "./(components)/sidebar";
import { gameMetadata } from "@/meta/gamedata";
import { GamePortrait } from "./(components)/game-portrait";

export default function Games() {
    return (
        <div className="flex space-x-5">
            <Sidebar className="hidden w-1/4 lg:block " />
            <div className="w-3/4 flex space-x-5">
                {gameMetadata.map((game) => (
                    <GamePortrait
                        key={game.name}
                        game={game}
                        width={250}
                        height={330}
                    />
                ))}
            </div>
        </div>
    );
}
