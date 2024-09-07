import { createClient } from "@supabase/supabase-js";

const projectUrl = process.env.REACT_APP_SUPABASE_URL!;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
const serviceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(projectUrl, anonKey, {
  auth: {
    flowType: "pkce",
    storage: localStorage,
  },
});
