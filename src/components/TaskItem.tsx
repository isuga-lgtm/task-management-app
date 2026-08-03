"use client";

import { Calendar, Trash2 } from "lucide-react";
import { toggleTask, deleteTask, updatePriority } from "@/app/actions";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  priority: "high" | "medium" | "low";
};

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "bg-rose-50 text-rose-600 border-rose-200 focus:ring-rose-100",
  medium: "bg-amber-50 text-amber-600 border-amber-200 focus:ring-amber-100",
  low: "bg-teal-50 text-teal-600 border-teal-200 focus:ring-teal-100",
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
    <li
      className={`flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        task.is_completed ? "border-slate-100 opacity-60" : "border-slate-200"
      }`}
    >
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={(e) => toggleTask(task.id, e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer rounded-full accent-teal-600"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={`truncate text-sm font-medium ${
            task.is_completed ? "text-slate-400 line-through" : "text-slate-800"
          }`}
        >
          {task.title}
        </span>
        {task.due_date && (
          <span
            className={`flex items-center gap-1 text-xs ${
              isOverdue ? "font-medium text-rose-500" : "text-slate-400"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            期限: {formatDueDate(task.due_date)}
          </span>
        )}
      </div>

      <select
        value={task.priority}
        onChange={(e) => updatePriority(task.id, e.target.value)}
        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 ${PRIORITY_STYLES[task.priority]}`}
      >
        <option value="high">{PRIORITY_LABELS.high}</option>
        <option value="medium">{PRIORITY_LABELS.medium}</option>
        <option value="low">{PRIORITY_LABELS.low}</option>
      </select>

      <button
        onClick={() => deleteTask(task.id)}
        aria-label="削除"
        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
