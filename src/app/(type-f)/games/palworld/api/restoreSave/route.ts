import { withErrorHandling } from "@/lib/utils";
import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(async (req: NextRequest) => {
    const body = await req.json();

    const filename = body.backupFile;
    const savFilename = body.savFilename;
    const s3FilePath = "s3://astraea-typef/1/backups";
    const instanceFilePath =
        "/home/palworld/Palworld/Pal/Saved/SaveGames/0/CE82E9C7575744E9B6708A9BFDBA8265/Players";

    // fetch instance / check instance is running
    const ec2 = new EC2Client({ region: "ap-southeast-1" });
    const ssm = new SSMClient({ region: "ap-southeast-1" });

    const response = await ec2.send(
        new DescribeInstancesCommand({
            Filters: [
                {
                    Name: "tag:Game",
                    Values: ["Palworld"],
                },
                {
                    Name: "tag:InstanceType",
                    Values: ["GAME_SERVER"],
                },
                {
                    Name: "instance-state-name",
                    Values: ["pending", "running"],
                },
            ],
        })
    );

    const reservations = response.Reservations;
    if (reservations && reservations.length === 1) {
        const instances = reservations[0].Instances;

        if (instances && instances.length === 1) {
            const instance = instances[0];
            const instanceId = instance.InstanceId;

            console.log(instanceId);
            console.log(savFilename);
            console.log(filename);

            // Use SSM to run the command to restore the save file
            // const command = `aws s3 cp s3://${s3FilePath}/${filename} ${}/${filename} && chown palworld:palworld ${instanceFilePath}/${filename} && chmod 600 ${instanceFilePath}/${filebame}`;
            if (instanceId) {
                const res = await ssm.send(
                    new SendCommandCommand({
                        InstanceIds: [instanceId],
                        DocumentName: "AWS-RunShellScript",
                        Parameters: {
                            commands: [
                                `aws s3 cp ${s3FilePath}/${savFilename}/${filename} /tmp/${filename}`,
                                `tar -xvf /tmp/${filename} -C ${instanceFilePath}`,
                                `rm /tmp/${filename}`,
                            ],
                        },
                    })
                );

                console.log(res);

                return new NextResponse(
                    JSON.stringify({ message: `Restored ${body.backupFile}.` }),
                    {
                        status: 200,
                    }
                );
            }
        }
        // return error for no running instances
        return new NextResponse(
            JSON.stringify({ message: `No running instances found.` }),
            {
                status: 404,
            }
        );
    }

    return new NextResponse(
        JSON.stringify({
            message: `Could not make a reservation with AWS services.`,
        }),
        {
            status: 503,
        }
    );
});
