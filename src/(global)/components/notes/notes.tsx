import { Alert, AlertDescription } from "../ui/alert";
import { Icons } from "../ui/icons";

const amber = "border-amber-300 text-amber-600";
const amber_fill = "text-amber-700 bg-amber-100";
const sky = "border-blue-500 text-blue-600";
const sky_fill = "text-blue-700 bg-sky-100";
const red = "border-red-500 text-red-600";
const red_fill = "text-red-700 bg-red-100";

export function Note({
    type,
    fill,
    children,
}: {
    type: "warning" | "info" | "error";
    fill?: boolean;
    children: React.ReactNode;
}) {
    let color = "";

    if (type === "warning") {
        color = fill ? amber_fill : amber;
    }

    if (type === "info") {
        color = fill ? sky_fill : sky;
    }

    if (type === "error") {
        color = fill ? red_fill : red;
    }

    return (
        <Alert className={color}>
            <div className="flex flex-row space-x-2 items-center">
                <Icon type={type} className="w-6 h-6"></Icon>
                <AlertDescription>{children}</AlertDescription>
            </div>
        </Alert>
    );
}

function Icon({
    type,
    className,
}: {
    type: "warning" | "info" | "error";
    className: string;
}) {
    if (type === "warning") {
        return (
            <Icons.exclamation_triangle className={`${className} ${amber}`} />
        );
    }

    if (type === "info") {
        return <Icons.check_circled className={`${className} ${sky}`} />;
    }

    if (type === "error") {
        return <Icons.cross_cricled className={`${className} ${red}`} />;
    }
}
