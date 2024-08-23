import { FormDataType } from "../types/FormDataType";

import { supabase } from "./supabase";

export async function login({ email, password }: FormDataType) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user.user_metadata.isAdmin) return data.session;
  else {
    console.log(data.user);
    throw new Error("You don't have permission to access this domain");
  }
}
