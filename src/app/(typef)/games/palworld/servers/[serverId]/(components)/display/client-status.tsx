import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/css/utils";
import { JSX, ClassAttributes, HTMLAttributes } from "react";

export function ClientStatus(
    props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement>
) {
    return (
        <div {...props}>
            <div className="flex flex-col items-start justify-start rounded-lg border p-4 space-y-2">
                <h1 className="text-xl font-semibold">Client</h1>
            </div>
        </div>
    );
}
