import Logo from "@/(global)/components/navigation/logo";
import { Icons } from "@/(global)/components/ui/icons";
import { Button } from "@/(global)/components/ui/button";
import { FooterNav } from "./footer-nav";

export default async function Footer() {
    return (
        <div className="flex-col flex">
            <div className="border-t">
                <div className="flex h-16 items-center px-4">
                    <div> © 2024</div>
                    <FooterNav className="mx-6" />
                </div>
            </div>
        </div>
    );
}
