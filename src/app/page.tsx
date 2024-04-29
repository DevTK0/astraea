import { redirect } from "next/navigation";
import { routes } from "@/(global)/configs/site";

export default function Landing() {
    redirect(routes.signIn);

    return <></>;
}
