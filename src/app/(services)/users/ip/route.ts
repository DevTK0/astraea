import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    let ip = req.ip || req.headers.get("X-Forwarded-For");

    return Response.json(ip);
}
