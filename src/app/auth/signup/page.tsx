import { redirect } from "next/navigation";
import Link from "next/link";

import Logo from "@/(global)/components/ui/logo";
import { getSession } from "@/(global)/lib/auth/server";
import { routes } from "@/(global)/configs/site";

import { SignUpForm } from "./(local)/sign-up-form";

export default async function SignUp() {
    const {
        data: { session },
    } = await getSession();

    if (session) {
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
                                Create an account
                            </h1>
                        </div>
                        <SignUpForm />
                        <div>
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/signin"
                                    className="underline hover:text-primary"
                                >
                                    Sign in
                                </Link>
                            </p>
                            <p className="px-8 underline text-center text-sm text-muted-foreground hover:text-primary mt-2">
                                <Link href="/auth/forgot-password">
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
