import { Separator } from "@/(global)/components/ui/separator";
import { RestartServer } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/restart-server/restart-server";
import { StartServer } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/start-server/start-server";
import { StopServer } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/stop-server/stop-server";
import { WhitelistIp } from "@/app/(typef)/games/[game]/servers/[serverId]/commands/whitelist-ip/whitelist-ip";

export default function Commands() {
    return (
        <main className="flex flex-1 flex-col gap-4 ">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Commands</h1>
            </div>
            <div className="space-y-4">
                <WhitelistIp port={9876} />
                <StartServer />
                <StopServer />
                <RestartServer />
            </div>

            <Separator className="my-4" />
        </main>
    );
}
