"use server";

import { revalidatePath } from "next/cache";
import { createClientWithCookies, createAdminClient } from "@/utils/supabase/server";

// login
export async function login(data: { email: string; password: string }): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClientWithCookies();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// check if email is registered to an existing user
export async function isEmailRegistered(email: string): Promise<boolean> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.rpc("check_user_exists_by_email", {
    email_param: email.toLowerCase()
  });

  if (error) throw error;

  const userExists = data && data.length > 0 && data[0].user_exists;

  return userExists;
}

// signup
export async function signup(data: { email: string; password: string }): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClientWithCookies();
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
