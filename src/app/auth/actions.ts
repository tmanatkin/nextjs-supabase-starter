"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// login
export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// signup
export async function signup(data: { email: string; password: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
