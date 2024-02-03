import { NextRequest } from "next/server";

// import Rcon from "ts-rcon";

export async function GET(req: NextRequest) {
    let ip = req.ip || req.headers.get("X-Forwarded-For");

    // const host = "122.248.217.49";
    // const port = 25575;
    // const password = "palsarefriendsnotfood";
    // const options = {
    //     tcp: false, // false for UDP, true for TCP (default is TCP)
    //     challenge: false, // true to use the challenge protocol (default is true)
    // };

    // console.log("start");

    // const client = new Rcon(host, port, password, options);

    // client
    //     .on("auth", async () => {
    //         console.log("Authed!");
    //         await new Promise((r) => setTimeout(r, 10000));
    //         client.send("hi");
    //     })
    //     .on("response", (str) => {
    //         console.log("Got response: " + str);
    //         client.disconnect();
    //     })
    //     .on("error", (err) => {
    //         console.log("Error: " + err);
    //         client.disconnect();
    //     })
    //     .on("end", () => {
    //         console.log("Socket closed!");
    //     });

    // await new Promise((r) => setTimeout(r, 10000));

    // client.connect();

    // console.log("Connected!");

    return Response.json(ip);
}
