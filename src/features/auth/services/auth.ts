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

  if (data.user.role === "admin" || data.user.role === "maintainer") {
    return data.session;
  } else {
    throw new Error("You don't have access to this domain");
  }
}
