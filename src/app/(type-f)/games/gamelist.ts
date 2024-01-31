export type Gamelist = (typeof gamelist)[number];

export interface Game {
    name: string;
    link: string;
    thumbnail: string;
    banner: string;
    active: boolean;
}

export const gamelist = [
    {
        name: "Palworld",
        link: "/games/palworld",
        thumbnail:
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_600x900_2x.jpg?t=1705661524",
        banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_hero.jpg?t=1705661524",
        active: true,
    },
    {
        name: "V Rising",
        link: "/games/vrising",
        thumbnail:
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1604030/library_600x900_2x.jpg?t=1694689356",
        banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1604030/library_hero.jpg?t=1694689356",
        active: false,
    },
    {
        name: "Core Keeper",
        link: "/games/corekeeper",
        thumbnail:
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1621690/library_600x900_2x.jpg?t=1700216976",
        banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1621690/library_hero.jpg?t=1700216976",
        active: true,
    },
    {
        name: "Minecraft",
        link: "/games/minecraft",
        thumbnail: "/thumbnails/minecraft.jpg",
        banner: "/banners/minecraft.jpg",
        active: true,
    },
];
