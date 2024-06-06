/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    images: {
        remotePatterns: [
            { hostname: "images.unsplash.com" },
            { hostname: "discord.com" },
            { hostname: "cdn.cloudflare.steamstatic.com" },
        ],
    },
};

module.exports = nextConfig;
