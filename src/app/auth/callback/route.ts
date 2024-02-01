import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/actions";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const cookieStore = cookies();
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = createClient(cookieStore);
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // change this to wherever you want to redirect the user after authentication completes
            return NextResponse.redirect(requestUrl.origin);
        }

        console.log("error", error);
    }

    // return the user to an error page with instructions
    // return NextResponse.redirect('/auth/error')
}
