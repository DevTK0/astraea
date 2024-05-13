import { Note } from "@/(global)/components/notes/notes";
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
    {
        label: "Settings",
        path: "settings",
    },
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
        <ServerSideBar routes={routes} serverName="Astraea Palworld">
            <Note type="warning">
                Weekend servers are only available from Friday 6:00 PM to Sunday
                2:00 AM.
            </Note>
            {children}
        </ServerSideBar>
    );
}
