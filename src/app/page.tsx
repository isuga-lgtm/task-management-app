import Image from "next/image";
import { ListTodo } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { addTask } from "./actions";
import TaskItem from "@/components/TaskItem";

export default async function Home() {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, is_completed, due_date, priority")
    .order("is_completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const remaining = tasks?.filter((t) => !t.is_completed).length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
          <Image
            src="/logo.png"
            alt="on call"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <ListTodo className="h-5 w-5 text-teal-600" />
            <h1 className="text-lg font-semibold text-slate-800">タスク一覧</h1>
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
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                期限日を選択
              </label>
              <input
                name="due_date"
                type="date"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="sm:w-36">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                優先度
              </label>
              <select
                name="priority"
                defaultValue="medium"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="high">優先度: 高</option>
                <option value="medium">優先度: 中</option>
                <option value="low">優先度: 低</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md active:scale-[0.98] sm:w-auto"
            >
              追加
            </button>
          </div>
        </form>

        {tasks && tasks.length > 0 && (
          <p className="mb-3 px-1 text-xs font-medium text-slate-400">
            未完了 {remaining} / 全 {tasks.length} 件
          </p>
        )}

        <ul className="flex flex-col gap-2.5">
          {tasks?.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>

        {tasks?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 py-14 text-center">
            <ListTodo className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-400">タスクはまだありません</p>
          </div>
        )}
      </main>
    </div>
  );
}
