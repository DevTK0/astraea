import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeCodeForSession } from "@/(global)/lib/auth/actions";
import { redirect } from "next/navigation";
import { routes } from "@/(global)/configs/site";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const { error } = await exchangeCodeForSession(code);

        if (!error) {
            redirect(routes.landing);
        }
    }

    // return the user to an error page with instructions
    // return NextResponse.redirect('/auth/error')
}
