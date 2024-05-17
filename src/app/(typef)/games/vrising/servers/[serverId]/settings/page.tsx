import { ClientSettings } from "./client-settings/client-settings";

export default function Settings() {
    return (
        <main className="flex flex-1 flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            </div>
            <ClientSettings />
        </main>
    );
}
