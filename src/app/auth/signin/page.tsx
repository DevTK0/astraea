import { redirect } from "next/navigation";
import Logo from "@/components/ui/logo";
import { getUser } from "@/lib/auth/server";
import Link from "next/link";
import { UserAuthForm } from "./(components)/user-auth-form";
import { routes } from "@/configs/site";

export default async function SignIn() {
    const user = await getUser();

    if (user) {
        redirect(routes.landing);
    }

    return (
        <>
            <div className="container relative h-svh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative h-full hidden flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <Logo />
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Sign In
                            </h1>
                            {/* <p className="text-sm text-muted-foreground">
                                Enter your email below to create your account
                            </p> */}
                        </div>
                        <UserAuthForm />
                        <div>
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="underline hover:text-primary"
                                >
                                    Sign up
                                </Link>{" "}
                            </p>
                            <p className="px-8 underline text-center text-sm text-muted-foreground hover:text-primary mt-2">
                                <Link href="/forgot-password">
                                    Forgot password
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
