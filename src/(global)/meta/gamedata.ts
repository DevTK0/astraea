export interface Game {
    label: string;
    key: string; // should be lower case with no spaces
    link: string;
    thumbnail: string;
    banner: string;
    active: boolean;
}

export const palworld: Game = {
    label: "Palworld",
    key: "palworld",
    link: "/games/palworld/servers/1/overview",
    thumbnail:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_600x900_2x.jpg?t=1705661524",
    banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/library_hero.jpg?t=1705661524",
    active: true,
};

export const vrising: Game = {
    label: "V Rising",
    key: "vrising",
    link: "/games/vrising/servers/2/overview",
    thumbnail:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1604030/library_600x900_2x.jpg?t=1694689356",
    banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1604030/library_hero.jpg?t=1694689356",
    active: false,
};

export const corekeeper: Game = {
    label: "Core Keeper",
    key: "corekeeper",
    link: "/games/corekeeper/servers/3/overview",
    thumbnail:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1621690/library_600x900_2x.jpg?t=1700216976",
    banner: "https://cdn.cloudflare.steamstatic.com/steam/apps/1621690/library_hero.jpg?t=1700216976",
    active: true,
};

export const template: Game = {
    label: "Template",
    key: "test",
    link: "/games/test/servers/1/overview",
    thumbnail: "",
    banner: "",
    active: true,
};

export const gamelist = [
    palworld.key,
    corekeeper.key,
    vrising.key,
    template.key,
] as const;

export const gameMetadataList = [palworld, vrising, corekeeper];
