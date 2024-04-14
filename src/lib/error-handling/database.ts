import { PostgrestError } from "@supabase/supabase-js";

// Error from the Supabase client when making requests with the database
export class SupabaseDBError extends Error {
    error: PostgrestError;

    constructor(error: PostgrestError) {
        super(error.message);
        this.error = error;
    }
}
