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

//
export async function isEmailRegistered(email: string): Promise<boolean> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) throw error;

  const user = data.users.find((u) => u.email === email.toLowerCase());
  return !!user; // Return true if user exists, false otherwise
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
