import { createClient } from "@/lib/supabase/server";
import { addTask } from "./actions";
import { signOut } from "./login/actions";
import TaskItem from "@/components/TaskItem";

export default async function Home() {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, is_completed")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">タスク一覧</h1>
          <form action={signOut}>
            <button className="text-xs text-zinc-400 hover:text-zinc-600">
              ログアウト
            </button>
          </form>
        </div>

        <form action={addTask} className="mb-6 flex gap-2">
          <input
            name="title"
            type="text"
            placeholder="新しいタスクを入力"
            required
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
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
