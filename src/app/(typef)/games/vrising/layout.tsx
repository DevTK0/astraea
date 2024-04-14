import { vrising } from "@/meta/gamedata";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <h1 className="text-5xl">{vrising.name}</h1>
            {children}
        </>
    );
}
