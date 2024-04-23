import { redirect } from "next/navigation";
import { routes } from "@/configs/site";

export default function Landing() {
    redirect(routes.signIn);

    return <></>;
}
