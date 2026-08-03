import Image from "next/image";
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

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo.png" alt="on call" width={160} height={40} className="h-9 w-auto" />
          <h1 className="text-xl font-semibold text-zinc-900">タスク一覧</h1>
        </div>

        <form action={addTask} className="mb-6 flex flex-col gap-2 rounded-md border border-zinc-200 bg-white p-3">
          <input
            name="title"
            type="text"
            placeholder="新しいタスクを入力"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              name="due_date"
              type="date"
              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
            <select
              name="priority"
              defaultValue="medium"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            >
              <option value="high">優先度: 高</option>
              <option value="medium">優先度: 中</option>
              <option value="low">優先度: 低</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-md bg-[#00AEC7] px-4 py-2 text-sm font-medium text-white hover:bg-[#0090a6]"
          >
            追加
          </button>
        </form>

        <ul className="flex flex-col gap-2">
          {tasks?.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
          {tasks?.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-400">
              タスクはまだありません
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
