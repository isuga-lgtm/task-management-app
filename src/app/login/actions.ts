"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません。",
  "Email not confirmed": "メールアドレスの確認が完了していません。",
  "User already registered": "このメールアドレスは既に登録されています。",
  "Password should be at least 6 characters": "パスワードは6文字以上で入力してください。",
  "Unable to validate email address: invalid format": "メールアドレスの形式が正しくありません。",
  "signup requires a valid password": "有効なパスワードを入力してください。",
};

function translateError(message: string) {
  return ERROR_MESSAGES[message] ?? "エラーが発生しました。時間をおいて再度お試しください。";
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?mode=signin&error=${encodeURIComponent(translateError(error.message))}`);
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(translateError(error.message))}`);
  }

  redirect(
    `/login?mode=signin&message=${encodeURIComponent(
      "登録できました。そのままログインしてください。"
    )}`
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
