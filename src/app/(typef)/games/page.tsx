import { gameMetadataList } from "@/(global)/meta/gamedata";

import { Sidebar } from "./(local)/sidebar";
import { GamePortrait } from "./(local)/game-portrait";

export default function Games() {
    return (
        <div className="w-full flex-1 h-full px-4 py-6 space-y-4 lg:px-8 ">
            <div className="flex space-x-5">
                <Sidebar className="hidden w-1/4 lg:block " />
                <div className="w-3/4 flex space-x-5">
                    {gameMetadataList.map((game) => (
                        <GamePortrait
                            key={game.key}
                            game={game}
                            width={250}
                            height={330}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
