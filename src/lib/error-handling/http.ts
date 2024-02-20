import { NextRequest } from "next/server";

export function withErrorHandling(
    handler: (
        req: NextRequest,
        { params }: { params: any }
    ) => Promise<Response>
) {
    return async function (req: NextRequest, { params }: { params: any }) {
        try {
            return await handler(req, params);
        } catch (error) {
            if (error instanceof HTTPError) {
                const httpError = error as HTTPError;
                console.error(httpError.message);
                return new Response(
                    JSON.stringify({ message: httpError.message }),
                    {
                        status: httpError.status,
                    }
                );
            } else if (error instanceof Error) {
                console.error(error.message);
                return new Response(
                    JSON.stringify({ message: error.message }),
                    {
                        status: 500,
                    }
                );
            }
        }
    };
}

/*
 * This class is used to wrap errors and provide a status code for the error.
 */
export class HTTPError extends Error {
    status: number;
    cause: unknown;

    constructor(message: string, statusCode: number, error?: Error) {
        super(message);

        this.status = statusCode;

        if (error) {
            this.stack = error.stack;
            this.cause = "cause" in error ? error.cause : error;
        }
    }
}
