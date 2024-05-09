import { routes } from "@/(global)/configs/site";
import { redirect } from "next/navigation";

export default function Home() {
    redirect(routes.landing);
    return <> Placeholder Homepage </>;
}
