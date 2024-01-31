"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContext = {
    client: any;
};

const Context = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const client = createClient();
    const router = useRouter();

    useEffect(() => {
        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((event: string) => {
            if (event === "SIGNED_IN") router.push("/games");
            if (event === "SIGNED_OUT") router.push("/signin");
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, client]);

    return (
        <Context.Provider value={{ client }}>
            <>{children}</>
        </Context.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
