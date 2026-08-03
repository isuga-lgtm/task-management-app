"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTask(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;

  const dueDate = formData.get("due_date") as string;
  const priority = formData.get("priority") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("tasks").insert({
    title,
    user_id: user.id,
    due_date: dueDate || null,
    priority: priority || "medium",
  });
  revalidatePath("/");
}

export async function toggleTask(id: string, isCompleted: boolean) {
  const supabase = await createClient();
  await supabase.from("tasks").update({ is_completed: isCompleted }).eq("id", id);
  revalidatePath("/");
}

export async function updatePriority(id: string, priority: string) {
  const supabase = await createClient();
  await supabase.from("tasks").update({ priority }).eq("id", id);
  revalidatePath("/");
}

export async function updateTask(id: string, title: string, dueDate: string) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({ title: trimmed, due_date: dueDate || null })
    .eq("id", id);
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/");
}
