"use client";

import * as React from "react";

import { Icons } from "@/(global)/components/ui/icons";
import { Button } from "@/(global)/components/ui/button";
import { Input } from "@/(global)/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/(global)/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/(global)/components/ui/alert";

const resetPasswordSchema = z.object({
    email: z.string().email(),
});

export type FormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resetPasswordError, setResetPasswordError] = useState<string>("");
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function resetPassword(values: FormValues) {
        setIsLoading(true);

        const error = new Error("Not implemented");

        // const error = await signInWithPassword(values);

        if (error) {
            setResetPasswordError(error.message);
        } else {
            router.refresh();
        }

        setIsLoading(false);
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(resetPassword)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel> Reset Password</FormLabel> */}
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
                    <div>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="w-full mt-4"
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Send recovery email
                        </Button>
                        {resetPasswordError && (
                            <Alert variant="destructive" className="mt-6">
                                <AlertDescription className="flex font-bold">
                                    <Icons.exclamation_triangle className="h-5 w-5 mr-2" />
                                    {resetPasswordError}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
