import Logo from "@/(global)/components/navigation/logo";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { getUser } from "@/(global)/lib/auth/server";
import { Icons } from "@/(global)/components/ui/icons";
import { Button } from "@/(global)/components/ui/button";
import { getCoins } from "@/(global)/services/database/users";

export default async function Navbar() {
    const user = await getUser();
    const coins = await getCoins(user.id);

    return (
        <div className="flex-col flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <Logo />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-6">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <Icons.coin className="h-4 w-4 text-yellow-500" />
                            </Button>
                            <div className="text-yellow-500"> {coins} </div>
                        </div>
                        <UserNav user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
