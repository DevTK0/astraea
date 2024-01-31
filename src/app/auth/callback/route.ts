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
        await supabase.auth.exchangeCodeForSession(code);
    }

    console.log(requestUrl.origin);

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin);
}
