"use client";
import { Alert, AlertDescription } from "@/(global)/components/ui/alert";
import { Button } from "@/(global)/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/(global)/components/ui/form";
import { Icons } from "@/(global)/components/ui/icons";
import { Input } from "@/(global)/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { signUpWithPassword } from "@/(global)/lib/auth/client";
import { signInWithDiscord } from "@/(global)/lib/auth/client";
import z from "zod";
import { useState } from "react";

const signUpSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        password2: z.string().min(8),
    })
    .refine((data) => data.password === data.password2, {
        message: "Passwords do not match",
        path: ["password2"],
    });

type FormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [signUpError, setSignUpError] = useState<string>("");
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            password2: "",
        },
    });

    async function emailSignUp(values: FormValues) {
        setIsLoading(true);

        const error = await signUpWithPassword(values);

        if (error) {
            setSignUpError(error.message);
        } else {
            router.refresh();
        }

        setIsLoading(false);
    }

    async function discordSignUp() {
        setIsLoading(true);
        await signInWithDiscord();
    }

    return (
        <div className="grid gap-6">
            <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={discordSignUp}
            >
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.discord className="mr-2 h-4 w-4" />
                )}{" "}
                Discord
            </Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(emailSignUp)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Email </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        value={field.value}
                                        onChange={field.onChange}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Password </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        value={field.value}
                                        onChange={field.onChange}
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Confirm Password </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        value={field.value}
                                        onChange={field.onChange}
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button
                            // disabled={isLoading}
                            type="submit"
                            className="w-full mt-4"
                            // onClick={() => console.log("hi")}
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign Up with Email
                        </Button>
                        {signUpError && (
                            <Alert variant="destructive" className="mt-6">
                                <AlertDescription className="flex font-bold">
                                    <Icons.exclamation_triangle className="h-5 w-5 mr-2" />
                                    {signUpError}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};
