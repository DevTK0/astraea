import Logo from "@/(global)/components/ui/logo";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { getUser } from "@/(global)/lib/auth/server";
import { redirect } from "next/navigation";
import { Icons } from "../../../../(global)/components/ui/icons";
import { Button } from "../../../../(global)/components/ui/button";

export default async function Navbar() {
    const user = await getUser();

    return (
        <div className="flex-col flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <Logo />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-12">
                        <div className="flex items-center">
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <Icons.sketch className="h-4 w-4 text-cyan-500" />
                            </Button>
                            <div className="text-cyan-500"> 500 </div> */}
                        </div>
                        <UserNav user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
