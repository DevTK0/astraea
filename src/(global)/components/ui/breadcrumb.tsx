"use client";

import { Icons } from "@/(global)/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = {
    name: string;
    href: string;
    current: boolean;
};

export default function Breadcrumb() {
    const path = usePathname();

    const sublinks = path.split("/").filter((x) => x !== "");

    const pages: Page[] = [];

    sublinks.reduce((prev, curr, index) => {
        pages.push({
            name: curr,
            href: prev + "/" + curr,
            current: index === sublinks.length,
        });
        return prev + "/" + curr;
    }, "");

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <div>
                        <a
                            href="/home"
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <Icons.home
                                className="h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                            />
                            <span className="sr-only">Home</span>
                        </a>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name}>
                        <div className="flex items-center">
                            <Icons.chevron_right
                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                            />
                            <Link
                                href={page.href}
                                className="ml-4 text-sm font-medium capitalize text-gray-500 hover:text-gray-700"
                                aria-current={page.current ? "page" : undefined}
                            >
                                {page.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
