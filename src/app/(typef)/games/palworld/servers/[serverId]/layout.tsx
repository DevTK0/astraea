import { usePathname } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb";

export default function GamesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const game = {
        name: "Palworld Server 1",
        link: "/games/palworld/servers/1",
        thumbnail:
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_600x900_2x.jpg?t=1705661524",
        banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_hero.jpg?t=1705661524",
        active: true,
    };

    return (
        <div className="h-full px-4 py-6 space-y-4 lg:px-8">
            <Breadcrumb />
            <h1 className="text-5xl">{game.name}</h1>
            {/* <Image
                src={game.banner}
                alt={game.name}
                width={1000}
                height={100}
                className="rounded-lg mb-5 w-auto h-auto"
            /> */}
            {children}
        </div>
    );
}
