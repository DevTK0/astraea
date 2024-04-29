import { useEffect } from "react";
import { toast } from "../ui/use-toast";

export function useError(isError: boolean, error: Error | null) {
    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.message,
            });
        }
    }, [isError, error?.message]);
}
