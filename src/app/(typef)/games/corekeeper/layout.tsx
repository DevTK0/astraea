import { corekeeper } from "@/(global)/meta/gamedata";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <h1 className="text-5xl">{corekeeper.name}</h1>
            {children}
        </>
    );
}
