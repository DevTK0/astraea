"use client";
import { Alert, AlertDescription } from "@/(global)/components/ui/alert";
import { Button } from "@/(global)/components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/(global)/components/ui/form";
import { Icons } from "@/(global)/components/ui/icons";
import { Input } from "@/(global)/components/ui/input";
import { signInSchema } from "@/(global)/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm, Form } from "react-hook-form";
import { FormValues } from "../../signin/(local)/user-auth-form";

export const SignUpForm = () => {
    // const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className="grid gap-6">
            {/* <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={discordSignIn}
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
                    onSubmit={form.handleSubmit(emailSignIn)}
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
                    <div>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="w-full mt-4"
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign In with Email
                        </Button>
                        {signInError && (
                            <Alert variant="destructive" className="mt-6">
                                <AlertDescription className="flex font-bold">
                                    <Icons.exclamation_triangle className="h-5 w-5 mr-2" />
                                    {signInError}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </form>
            </Form> */}
        </div>
    );
};
