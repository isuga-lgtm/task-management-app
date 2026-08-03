"use client";

import { useState } from "react";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { toggleTask, deleteTask, updatePriority, updateTask } from "@/app/actions";

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

function toDateInputValue(dueDate: string | null) {
  if (!dueDate) return "";
  return new Date(dueDate).toISOString().slice(0, 10);
}

export default function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(toDateInputValue(task.due_date));

  const isOverdue =
    !task.is_completed && task.due_date && new Date(task.due_date) < new Date();

  function handleSave() {
    if (!title.trim()) {
      setTitle(task.title);
      setIsEditing(false);
      return;
    }
    updateTask(task.id, title, dueDate);
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDueDate(toDateInputValue(task.due_date));
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 rounded-xl border border-teal-200 bg-white p-5 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleCancel}
              className="h-9 rounded-lg px-3 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="h-9 rounded-lg bg-teal-600 px-4 text-xs font-semibold text-white hover:bg-teal-700"
            >
              保存
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`group flex items-center gap-3 rounded-xl border bg-white px-4 py-5 shadow-sm transition hover:shadow-md ${
        task.is_completed ? "border-slate-100 opacity-60" : "border-slate-200"
      }`}
    >
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={(e) => toggleTask(task.id, e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer rounded-full border-2 border-slate-300 accent-teal-600"
      />

      <div
        className="flex min-w-0 flex-1 flex-col gap-1 cursor-text"
        onDoubleClick={() => setIsEditing(true)}
      >
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
        onClick={() => setIsEditing(true)}
        aria-label="編集"
        className="shrink-0 rounded-lg p-2 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-500"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        onClick={() => deleteTask(task.id)}
        aria-label="削除"
        className="shrink-0 rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
