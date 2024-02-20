import { PostgrestError } from "@supabase/supabase-js";

export class DBError extends Error {
    error: PostgrestError;

    constructor(error: PostgrestError) {
        super(error.message);
        this.error = error;
    }
}
