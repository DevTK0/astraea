import { getSession } from "@/lib/supabase/server";
import AuthUI from "./AuthUI";
import { redirect } from "next/navigation";
import Logo from "@/components/ui/logo";
import { getURL } from "@/lib/utils";

export default async function SignIn() {
    const session = await getSession();

    if (session) {
        return redirect("/games"); // must be client side rendered page
    }

    const callback = `${getURL()}auth/callback`;

    console.log(callback);

    return (
        <>
            <div className="container relative h-svh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative h-full hidden flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <Logo />
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <AuthUI redirect={callback} />
                    </div>
                </div>
            </div>
        </>
    );
}
