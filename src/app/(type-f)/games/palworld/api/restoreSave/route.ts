import { withErrorHandling } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(async (req: NextRequest) => {
    const body = await req.json();

    console.log(body);

    // sleep 10s
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return new NextResponse(
        JSON.stringify({ message: `Restored ${body.savfile}.` }),
        {
            status: 200,
        }
    );
});
