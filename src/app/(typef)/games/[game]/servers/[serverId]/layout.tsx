import ServerLayout from "@/(global)/components/server/server-layout";

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
    {
        label: "Shop",
        path: "shop",
    },
];

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ServerLayout routes={routes} serverName="Template">
            {children}
        </ServerLayout>
    );
}
