import Logo from "@/components/ui/logo";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { getSession } from "@/lib/supabase/clients/server";

export default async function Navbar() {
    const session = await getSession();
    return (
        <div className="flex-col flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <Logo />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav user={session?.user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
