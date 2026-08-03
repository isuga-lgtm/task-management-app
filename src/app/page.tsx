import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ListTodo } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { addTask } from "./actions";
import TaskItem from "@/components/TaskItem";
import SortSelect from "@/components/SortSelect";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  priority: "high" | "medium" | "low";
  assignee: string | null;
  notes: string | null;
  link_url: string | null;
};

const PRIORITY_RANK: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 };

const FILTERS = [
  { value: "all", label: "すべて" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了済み" },
] as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const { filter = "all", sort = "default" } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("tasks")
    .select("id, title, is_completed, due_date, priority, assignee, notes, link_url");

  if (filter === "active") query = query.eq("is_completed", false);
  if (filter === "completed") query = query.eq("is_completed", true);

  const { data } = await query
    .order("is_completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const tasks = (data as Task[] | null) ?? [];

  const sorted = [...tasks];
  if (sort === "due") {
    sorted.sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  } else if (sort === "priority") {
    sorted.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  }

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.is_completed).length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3 sm:px-6">
          <Image
            src="/logo.png"
            alt="on call"
            width={320}
            height={80}
            className="h-16 w-auto sm:h-20"
          />
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <ListTodo className="h-5 w-5 text-teal-600" />
            <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">
              タスク一覧
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <form
          action={addTask}
          className="mb-6 rounded-2xl border border-white bg-white/90 p-5 shadow-[0_4px_20px_-4px_rgba(15,118,110,0.15)] backdrop-blur"
        >
          <input
            name="title"
            type="text"
            placeholder="新しいタスクを入力"
            required
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                期限日を選択
              </label>
              <input
                name="due_date"
                type="date"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="sm:w-36">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                優先度
              </label>
              <select
                name="priority"
                defaultValue="medium"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="high">優先度: 高</option>
                <option value="medium">優先度: 中</option>
                <option value="low">優先度: 低</option>
              </select>
            </div>

            <div className="sm:w-40">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                担当者
              </label>
              <input
                name="assignee"
                type="text"
                placeholder="例: 山田"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <button
              type="submit"
              className="h-10 rounded-lg bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md active:scale-[0.98] sm:w-auto"
            >
              追加
            </button>
          </div>

          <details className="group mt-3">
            <summary className="flex w-fit cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-teal-600">
              <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
              詳細・リンクを追加
            </summary>
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                name="notes"
                placeholder="備考メモ"
                rows={2}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
              <input
                name="link_url"
                type="url"
                placeholder="参考URL（Slack・Webリンクなど）"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </details>
        </form>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {FILTERS.map((f) => (
              <Link
                key={f.value}
                href={`/?filter=${f.value}${sort !== "default" ? `&sort=${sort}` : ""}`}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  filter === f.value
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          <SortSelect current={sort} />
        </div>

        {total > 0 && (
          <div className="mb-4 rounded-xl border border-slate-100 bg-white/70 px-4 py-3">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>
                未完了 {total - doneCount} / 全 {total} 件
              </span>
              <span className="text-teal-600">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-2.5">
          {sorted.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>

        {total === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 py-14 text-center">
            <ListTodo className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-400">タスクはまだありません</p>
          </div>
        )}
      </main>
    </div>
  );
}
