import Navbar from "./components/navbar";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "./components/sidebar";
import { gamelist } from "./games/gamelist";

export default async function TypeFLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const client = createClient(cookies());
    const {
        data: { session },
    } = await client.auth.getSession();

    if (!session) {
        redirect("/signin");
    }

    return (
        <>
            <Navbar />
            <div className="block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-5">
                            <Sidebar gamelist={gamelist} className="block" />
                            <div className="col-span-4 border-l">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
