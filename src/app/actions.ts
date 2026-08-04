"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const GENERIC_ERROR = "エラーが発生しました。時間をおいて再度お試しください。";

export async function addTask(formData: FormData): Promise<{ error: string | null }> {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "タスク名を入力してください。" };

  const dueDate = formData.get("due_date") as string;
  const priority = formData.get("priority") as string;
  const assignee = (formData.get("assignee") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();
  const linkUrl = (formData.get("link_url") as string)?.trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: GENERIC_ERROR };

  const { error } = await supabase.from("tasks").insert({
    title,
    user_id: user.id,
    due_date: dueDate || null,
    priority: priority || "medium",
    assignee: assignee || null,
    notes: notes || null,
    link_url: linkUrl || null,
  });

  if (error) return { error: GENERIC_ERROR };

  revalidatePath("/");
  return { error: null };
}

export async function toggleTask(id: string, isCompleted: boolean): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ is_completed: isCompleted }).eq("id", id);
  revalidatePath("/");
  return { error: error ? GENERIC_ERROR : null };
}

export async function updatePriority(id: string, priority: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ priority }).eq("id", id);
  revalidatePath("/");
  return { error: error ? GENERIC_ERROR : null };
}

export async function updateTask(
  id: string,
  fields: {
    title: string;
    dueDate: string;
    assignee: string;
    notes: string;
    linkUrl: string;
  }
): Promise<{ error: string | null }> {
  const trimmedTitle = fields.title.trim();
  if (!trimmedTitle) return { error: "タスク名を入力してください。" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      title: trimmedTitle,
      due_date: fields.dueDate || null,
      assignee: fields.assignee.trim() || null,
      notes: fields.notes.trim() || null,
      link_url: fields.linkUrl.trim() || null,
    })
    .eq("id", id);

  revalidatePath("/");
  return { error: error ? GENERIC_ERROR : null };
}

export async function deleteTask(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/");
  return { error: error ? GENERIC_ERROR : null };
}
