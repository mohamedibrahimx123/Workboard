"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  let redirectUrl = "/login?error=invalid_credentials";

  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      redirectUrl = "/login?error=invalid_input";
      redirect(redirectUrl);
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Secure server-side logging: keep technical details safe on server
      console.error("[Login Auth Error]", {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      });

      if (
        error.code === "email_not_confirmed" ||
        error.message?.toLowerCase().includes("not confirmed")
      ) {
        redirectUrl = "/login?error=email_not_confirmed";
        redirect(redirectUrl);
      }

      redirectUrl = "/login?error=invalid_credentials";
      redirect(redirectUrl);
    }

    revalidatePath("/", "layout");
    redirectUrl = "/dashboard";
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("[Unexpected Server Error] login exception:", error);
    redirectUrl = "/login?error=server_error";
  }

  redirect(redirectUrl);
}

export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("[Logout Error]", error);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}