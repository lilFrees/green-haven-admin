import { createClient } from "@supabase/supabase-js";

const projectUrl = process.env.REACT_APP_SUPABASE_URL!;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(projectUrl, anonKey, {
  auth: {
    flowType: "pkce",
    storage: localStorage,
  },
  realtime: {
    timeout: 0,
  },
});
