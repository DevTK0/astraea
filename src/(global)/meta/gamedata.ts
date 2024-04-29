export const gamelist = ["Palworld", "Corekeeper", "VRising"] as const;

export interface Game {
    name: string;
    link: string;
    thumbnail: string;
    banner: string;
    active: boolean;
}

export const palworld: Game = {
    name: "Palworld",
    link: "/games/palworld",
    thumbnail:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_600x900_2x.jpg?t=1705661524",
    banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_hero.jpg?t=1705661524",
    active: true,
};

export const vrising: Game = {
    name: "V Rising",
    link: "/games/vrising",
    thumbnail:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1604030/library_600x900_2x.jpg?t=1694689356",
    banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1604030/library_hero.jpg?t=1694689356",
    active: false,
};

export const corekeeper: Game = {
    name: "Core Keeper",
    link: "/games/corekeeper",
    thumbnail:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1621690/library_600x900_2x.jpg?t=1700216976",
    banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1621690/library_hero.jpg?t=1700216976",
    active: true,
};

export const gameMetadata = [palworld, vrising, corekeeper];
