"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { gamelist } from "./gamelist";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();
    const game = gamelist.find((game) => game.link === path) || {
        name: "",
        banner: "",
        link: "",
    };

    return (
        <div className="h-full px-4 py-6 lg:px-8">
            {path == "/games" ? (
                <>{children}</>
            ) : (
                <>
                    <h1 className="mb-3 text-5xl">{game.name}</h1>
                    <Image
                        src={game.banner}
                        alt={game.name}
                        width={1000}
                        height={100}
                        className="rounded-lg mb-5 w-auto h-auto"
                    />
                    {children}
                </>
            )}
        </div>
    );
}
