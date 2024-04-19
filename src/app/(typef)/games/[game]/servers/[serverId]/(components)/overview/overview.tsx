import { ServerStatus } from "./server-status/server-status";

export default function Overview() {
    return (
        <>
            <div className="flex flex-row items-start space-x-2">
                <ServerStatus className="w-full space-y-2" />
            </div>
        </>
    );
}
