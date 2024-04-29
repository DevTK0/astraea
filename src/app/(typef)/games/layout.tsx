import Breadcrumb from "@/(global)/components/ui/breadcrumb";

export default function GamesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full px-4 py-6 space-y-4 lg:px-8">
            <Breadcrumb />
            {children}
        </div>
    );
}
