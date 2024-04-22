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
