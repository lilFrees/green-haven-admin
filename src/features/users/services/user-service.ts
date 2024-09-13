"use server";

import { supabase } from "../../../shared/supabase/client";
import { IUser } from "../interface/IUser";

export async function getUsers() {
  const { data, error } = await supabase.from("admin_users").select("*");

  if (error) throw error;


  return data as IUser[];
}
