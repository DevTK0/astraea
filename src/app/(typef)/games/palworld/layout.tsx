import { palworld } from "@/(global)/meta/gamedata";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <h1 className="text-5xl">{palworld.name}</h1>
            {/* <Image
                src={game.banner}
                alt={game.name}
                width={1000}
                height={100}
                className="rounded-lg mb-5 w-auto h-auto"
            /> */}
            {children}
        </>
    );
}
