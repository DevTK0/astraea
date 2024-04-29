"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Logo from "@/(global)/components/ui/logo";
import { ResetPasswordForm } from "./(local)/reset-password";

export default function ForgotPassword() {
    const router = useRouter();

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
                                Reset Password
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email below to reset your password.
                            </p>
                            <ResetPasswordForm />
                        </div>
                        <div>
                            <p
                                onClick={router.back}
                                className="px-8 underline text-center text-sm text-muted-foreground hover:text-primary mt-2"
                            >
                                <Link href="" onClick={router.back}>
                                    Go back
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
