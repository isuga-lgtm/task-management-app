"use client";

import { toggleTask, deleteTask } from "@/app/actions";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
};

export default function TaskItem({ task }: { task: Task }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-zinc-200 px-4 py-3">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={(e) => toggleTask(task.id, e.target.checked)}
        className="h-4 w-4"
      />
      <span
        className={`flex-1 text-sm ${
          task.is_completed ? "text-zinc-400 line-through" : "text-zinc-900"
        }`}
      >
        {task.title}
      </span>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-xs text-zinc-400 hover:text-red-500"
      >
        削除
      </button>
    </li>
  );
}
