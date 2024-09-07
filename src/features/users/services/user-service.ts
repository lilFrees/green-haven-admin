import { supabase } from "../../auth/services/supabase";

export async function getAllUsers() {
  const { data, error } = await supabase.rpc("get_all_users");

  if (error) throw error;

  return data;
}
