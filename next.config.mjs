/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            { hostname: "images.unsplash.com" },
            { hostname: "discord.com" },
            { hostname: "cdn.cloudflare.steamstatic.com" },
        ],
    },
};

export default nextConfig;
