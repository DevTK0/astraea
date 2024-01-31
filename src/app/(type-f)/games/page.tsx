import { gamelist } from "./gamelist";

import { GamePortrait } from "../components/game-portrait";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="h-full space-y-6">
                <div className="relative">
                    <div className="flex space-x-5 pb-4">
                        {gamelist.map((game) => (
                            <Link href={game.link}>
                                <GamePortrait
                                    key={game.name}
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
