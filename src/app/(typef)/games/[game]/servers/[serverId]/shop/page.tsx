import { Separator } from "@/(global)/components/ui/separator";
import { WeekdayAccess } from "./weekday-access/weekday-access";
import { InstanceUpgrade } from "./instance-upgrade/instance-upgrade";

export default function Shop() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Shop</h1>
            </div>
            <div className="space-y-4">
                <WeekdayAccess />
                <InstanceUpgrade />
            </div>

            <Separator className="my-4" />
        </main>
    );
}
