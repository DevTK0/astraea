import { NextRequest } from "next/server";

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { HTTPError, withErrorHandling } from "@/lib/utils";
import { execute_query } from "@/lib/supabase/queries/execute_query";
import { getSavFilename } from "@/lib/supabase/queries/get_sav_filename";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/clients/actions";

export const GET = withErrorHandling(async (req: NextRequest) => {
    const cookieStore = cookies();
    const client = createClient(cookieStore);

    const {
        data: { user },
    } = await client.auth.getUser();

    const { sav_filename } = await execute_query(getSavFilename)(user?.id);

    if (sav_filename === null) {
        throw HTTPError("sav_filename is not linked", 404);
    }

    const aws = new S3Client({ region: "ap-southeast-1" });
    const response = await aws.send(
        new ListObjectsV2Command({
            Bucket: "astraea-typef",
            Prefix: `1/backups/${sav_filename}`,
        })
    );

    const backupSet: Set<string> = new Set<string>();

    response.Contents?.forEach((content) => {
        const filename = content.Key?.split("/")[3];
        if (filename) backupSet.add(filename);
    });

    return Response.json({
        saveFilename: sav_filename,
        backupList: Array.from(backupSet),
    });
});
