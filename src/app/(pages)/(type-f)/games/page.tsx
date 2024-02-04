import { gamelist } from "./gamelist";

import { GamePortrait } from "../components/game-portrait";
import Link from "next/link";

export default function Games() {
    return (
        <>
            <div className="h-full space-y-6">
                <div className="relative">
                    <div className="flex space-x-5 pb-4">
                        {gamelist.map((game) => (
                            <Link key={game.name} href={game.link}>
                                <GamePortrait
                                    game={game}
                                    width={250}
                                    height={330}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
