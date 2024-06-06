import ServerLayout from "@/(global)/components/server/server-layout";

const routes = [
    {
        label: "Create",
        path: "create",
    },
];

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ServerLayout routes={routes} serverName="Hosting">
            {children}
        </ServerLayout>
    );
}
