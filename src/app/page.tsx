import Image from "next/image";
import Link from "next/link";
import { ListTodo } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./login/actions";
import TaskItem from "@/components/TaskItem";
import SortSelect from "@/components/SortSelect";
import SearchInput from "@/components/SearchInput";
import AddTaskForm from "@/components/AddTaskForm";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  priority: "high" | "medium" | "low";
  assignee: string | null;
  notes: string | null;
  link_url: string | null;
  created_at: string;
  updated_at: string;
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
  searchParams: Promise<{ filter?: string; sort?: string; q?: string }>;
}) {
  const { filter = "all", sort = "default", q = "" } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("tasks")
    .select(
      "id, title, is_completed, due_date, priority, assignee, notes, link_url, created_at, updated_at"
    );

  if (filter === "active") query = query.eq("is_completed", false);
  if (filter === "completed") query = query.eq("is_completed", true);

  const { data } = await query
    .order("is_completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  let tasks = (data as Task[] | null) ?? [];

  if (q.trim()) {
    const keyword = q.trim().toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(keyword) ||
        t.assignee?.toLowerCase().includes(keyword)
    );
  }

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
          <div className="flex flex-1 items-center gap-1.5">
            <ListTodo className="h-5 w-5 text-teal-600" />
            <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">
              タスク一覧
            </h1>
          </div>
          <form action={signOut}>
            <button className="text-xs font-medium text-slate-400 hover:text-slate-600">
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <AddTaskForm />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {FILTERS.map((f) => (
              <Link
                key={f.value}
                href={`/?filter=${f.value}${sort !== "default" ? `&sort=${sort}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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

        <div className="mb-4">
          <SearchInput key={q} current={q} />
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
            <p className="text-sm text-slate-400">
              {q ? "該当するタスクが見つかりません" : "タスクはまだありません"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
