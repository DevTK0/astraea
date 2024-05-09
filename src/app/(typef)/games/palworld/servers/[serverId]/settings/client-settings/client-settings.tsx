import { getClientSettingsAction } from "./client-settings.action";
import { ClientSettingsForm } from "./client-settings.client";

export async function ClientSettings() {
    const { data: clientSettings } = await getClientSettingsAction({});

    return <ClientSettingsForm defaultValues={clientSettings} />;
}
