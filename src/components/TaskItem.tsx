"use client";

import { toggleTask, deleteTask, updatePriority } from "@/app/actions";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  priority: "high" | "medium" | "low";
};

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  high: "高",
  medium: "中",
  low: "低",
};

function formatDueDate(dueDate: string) {
  const date = new Date(dueDate);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function TaskItem({ task }: { task: Task }) {
  const isOverdue =
    !task.is_completed && task.due_date && new Date(task.due_date) < new Date();

  return (
    <li className="flex items-center gap-3 rounded-md border border-zinc-200 px-4 py-3">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={(e) => toggleTask(task.id, e.target.checked)}
        className="h-4 w-4"
      />

      <div className="flex flex-1 flex-col gap-1">
        <span
          className={`text-sm ${
            task.is_completed ? "text-zinc-400 line-through" : "text-zinc-900"
          }`}
        >
          {task.title}
        </span>
        {task.due_date && (
          <span className={`text-xs ${isOverdue ? "text-red-500" : "text-zinc-400"}`}>
            期限: {formatDueDate(task.due_date)}
          </span>
        )}
      </div>

      <select
        value={task.priority}
        onChange={(e) => updatePriority(task.id, e.target.value)}
        className={`rounded-full border px-2 py-1 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
      >
        <option value="high">{PRIORITY_LABELS.high}</option>
        <option value="medium">{PRIORITY_LABELS.medium}</option>
        <option value="low">{PRIORITY_LABELS.low}</option>
      </select>

      <button
        onClick={() => deleteTask(task.id)}
        className="text-xs text-zinc-400 hover:text-red-500"
      >
        削除
      </button>
    </li>
  );
}
