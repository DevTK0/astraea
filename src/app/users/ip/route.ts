import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    let ip = req.ip || req.headers.get("X-Forwarded-For");

    if (ip === "::1") {
        ip = "127.0.0.1";
    }

    return Response.json(ip);
}
