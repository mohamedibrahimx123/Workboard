"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedPriorities = ["low", "medium", "high"] as const;
const allowedStatuses = ["todo", "in_progress", "completed"] as const;
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getSafePageParam(formData: FormData): string {
  const page = formData.get("page");
  if (typeof page === "string" && /^\d+$/.test(page) && parseInt(page, 10) > 1) {
    return `page=${page}&`;
  }
  return "";
}

export async function createTask(formData: FormData) {
  let redirectUrl = "/dashboard?error=task_create_failed";

  try {
    const title = formData.get("title");
    const description = formData.get("description") ?? "";
    const priority = formData.get("priority");
    const dueDate = formData.get("due_date");

    // 1. Strict Input Validation
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof priority !== "string" ||
      (dueDate !== null && typeof dueDate !== "string")
    ) {
      redirectUrl = "/dashboard?error=invalid_input";
      redirect(redirectUrl);
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const cleanDueDate = typeof dueDate === "string" ? dueDate.trim() : "";

    if (
      trimmedTitle.length < 1 ||
      trimmedTitle.length > 200 ||
      trimmedDescription.length > 5000 ||
      !allowedPriorities.includes(
        priority as (typeof allowedPriorities)[number]
      )
    ) {
      redirectUrl = "/dashboard?error=invalid_input";
      redirect(redirectUrl);
    }

    if (cleanDueDate !== "" && !isValidDate(cleanDueDate)) {
      redirectUrl = "/dashboard?error=invalid_input";
      redirect(redirectUrl);
    }

    // 2. Authentication check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirectUrl = "/login";
      redirect(redirectUrl);
    }

    // 3. Database Insert
    const { error: insertError } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: trimmedTitle,
      description: trimmedDescription || null,
      priority,
      due_date: cleanDueDate || null,
      status: "todo",
    });

    if (insertError) {
      // Secure logging on server: never expose database schema to the client
      console.error("[Database Error] createTask failed:", {
        code: insertError.code,
        message: insertError.message,
        timestamp: new Date().toISOString(),
      });

      redirectUrl = "/dashboard?error=task_create_failed";
      redirect(redirectUrl);
    }

    // 4. Success: Revalidate & redirect to first page so the new task is seen
    revalidatePath("/dashboard");
    redirectUrl = "/dashboard?success=task_created";
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error which must be rethrown
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("[Unexpected Server Error] createTask exception:", error);
    redirectUrl = "/dashboard?error=server_error";
  }

  redirect(redirectUrl);
}

export async function updateTask(formData: FormData) {
  let redirectUrl = "/dashboard?error=task_update_failed";
  const pagePrefix = getSafePageParam(formData);

  try {
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description") ?? "";
    const status = formData.get("status");
    const priority = formData.get("priority");
    const dueDate = formData.get("due_date");

    // 1. Validate ID format & types
    if (
      typeof id !== "string" ||
      !uuidRegex.test(id) ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof status !== "string" ||
      typeof priority !== "string" ||
      (dueDate !== null && typeof dueDate !== "string")
    ) {
      redirectUrl = `/dashboard?${pagePrefix}error=invalid_input`;
      redirect(redirectUrl);
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const cleanDueDate = typeof dueDate === "string" ? dueDate.trim() : "";

    if (
      trimmedTitle.length < 1 ||
      trimmedTitle.length > 200 ||
      trimmedDescription.length > 5000 ||
      !allowedStatuses.includes(status as (typeof allowedStatuses)[number]) ||
      !allowedPriorities.includes(
        priority as (typeof allowedPriorities)[number]
      ) ||
      (cleanDueDate !== "" && !isValidDate(cleanDueDate))
    ) {
      redirectUrl = `/dashboard?${pagePrefix}error=invalid_input`;
      redirect(redirectUrl);
    }

    // 2. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirectUrl = "/login";
      redirect(redirectUrl);
    }

    // 3. Update task (guaranteed user ownership via user_id filter)
    const { data, error: updateError } = await supabase
      .from("tasks")
      .update({
        title: trimmedTitle,
        description: trimmedDescription || null,
        status,
        priority,
        due_date: cleanDueDate || null,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error("[Database Error] updateTask failed:", {
        code: updateError.code,
        message: updateError.message,
        timestamp: new Date().toISOString(),
      });

      redirectUrl = `/dashboard?${pagePrefix}error=task_update_failed`;
      redirect(redirectUrl);
    }

    if (!data) {
      redirectUrl = `/dashboard?${pagePrefix}error=task_not_found`;
      redirect(redirectUrl);
    }

    revalidatePath("/dashboard");
    redirectUrl = `/dashboard?${pagePrefix}success=task_updated`;
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

    console.error("[Unexpected Server Error] updateTask exception:", error);
    redirectUrl = `/dashboard?${pagePrefix}error=server_error`;
  }

  redirect(redirectUrl);
}

export async function deleteTask(formData: FormData) {
  let redirectUrl = "/dashboard?error=task_delete_failed";
  const pagePrefix = getSafePageParam(formData);

  try {
    const id = formData.get("id");

    if (typeof id !== "string" || !uuidRegex.test(id)) {
      redirectUrl = `/dashboard?${pagePrefix}error=invalid_input`;
      redirect(redirectUrl);
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirectUrl = "/login";
      redirect(redirectUrl);
    }

    const { data, error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error("[Database Error] deleteTask failed:", {
        code: deleteError.code,
        message: deleteError.message,
        timestamp: new Date().toISOString(),
      });

      redirectUrl = `/dashboard?${pagePrefix}error=task_delete_failed`;
      redirect(redirectUrl);
    }

    if (!data) {
      redirectUrl = `/dashboard?${pagePrefix}error=task_not_found`;
      redirect(redirectUrl);
    }

    revalidatePath("/dashboard");
    redirectUrl = `/dashboard?${pagePrefix}success=task_deleted`;
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

    console.error("[Unexpected Server Error] deleteTask exception:", error);
    redirectUrl = `/dashboard?${pagePrefix}error=server_error`;
  }

  redirect(redirectUrl);
}
