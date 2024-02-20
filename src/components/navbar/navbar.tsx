import Logo from "@/components/ui/logo";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { getUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function Navbar() {
    const user = await getUser();

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="flex-col flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <Logo />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
