import { createClient as _createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = _createClient(supabaseUrl, supabaseKey);
export { _createClient as createClient };
