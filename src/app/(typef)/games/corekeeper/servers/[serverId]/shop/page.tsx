import { Separator } from "@/(global)/components/ui/separator";
import { InstanceUpgrade } from "@/app/(typef)/games/[game]/servers/[serverId]/shop/instance-upgrade/instance-upgrade";
import { WeekdayAccess } from "@/app/(typef)/games/[game]/servers/[serverId]/shop/weekday-access/weekday-access";

export default function Shop({
    params,
}: {
    params: { game: string; serverId: number };
}) {
    return (
        <main className="flex flex-1 flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Shop</h1>
            </div>
            <div className="space-y-4">
                <WeekdayAccess />
                <InstanceUpgrade serverId={params.serverId} />
            </div>

            <Separator className="my-4" />
        </main>
    );
}
