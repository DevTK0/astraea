import { getClientSettingsAction } from "./client-settings.action";
import { ClientComponent } from "./client-settings.client";

export async function ClientSettings() {
    const { data: defaultValues } = await getClientSettingsAction({});

    return <ClientComponent defaultValues={defaultValues} />;
}
