import ServerSideBar from "@/(global)/components/server/server-side-bar";

const routes = [
    {
        label: "Overview",
        path: "overview",
    },
    {
        label: "Commands",
        path: "commands",
    },
    // {
    //     label: "Settings",
    //     path: "settings",
    // },
    // {
    //     label: "Shop",
    //     path: "shop",
    // },
];

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ServerSideBar routes={routes} serverName="Astraea V Rising">
            {children}
        </ServerSideBar>
    );
}
