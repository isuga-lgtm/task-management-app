"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Pencil, Trash2, User } from "lucide-react";
import { toggleTask, deleteTask, updatePriority, updateTask } from "@/app/actions";

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
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}/${mm}/${dd}`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${date.getFullYear()}/${mm}/${dd} ${hh}:${min}`;
}

function toDateInputValue(dueDate: string | null) {
  if (!dueDate) return "";
  return new Date(dueDate).toISOString().slice(0, 10);
}

function getDueBadge(dueDate: string | null, isCompleted: boolean) {
  if (!dueDate || isCompleted) return null;

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}日超過`, className: "bg-rose-100 text-rose-600" };
  }
  if (diffDays === 0) {
    return { text: "今日", className: "bg-amber-100 text-amber-700" };
  }
  if (diffDays === 1) {
    return { text: "明日", className: "bg-amber-50 text-amber-600" };
  }
  return { text: `あと${diffDays}日`, className: "bg-slate-100 text-slate-500" };
}

export default function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(toDateInputValue(task.due_date));
  const [assignee, setAssignee] = useState(task.assignee ?? "");
  const [notes, setNotes] = useState(task.notes ?? "");
  const [linkUrl, setLinkUrl] = useState(task.link_url ?? "");

  const dueBadge = getDueBadge(task.due_date, task.is_completed);

  function handleSave() {
    if (!title.trim()) {
      setTitle(task.title);
      setIsEditing(false);
      return;
    }
    updateTask(task.id, { title, dueDate, assignee, notes, linkUrl });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDueDate(toDateInputValue(task.due_date));
    setAssignee(task.assignee ?? "");
    setNotes(task.notes ?? "");
    setLinkUrl(task.link_url ?? "");
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
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="担当者"
            className="h-9 w-28 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <details className="group">
          <summary className="flex w-fit cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-teal-600">
            <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
            詳細・リンクを編集
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="備考メモ"
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="参考URL"
              className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </details>

        <div className="flex justify-end gap-2">
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
      </li>
    );
  }

  return (
    <li
      className={`group flex flex-col gap-2 rounded-xl border bg-white px-4 py-5 shadow-sm transition hover:shadow-md ${
        task.is_completed ? "border-slate-100 opacity-60" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
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

          {(task.due_date || task.assignee) && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              {task.due_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  期限: {formatDueDate(task.due_date)}
                </span>
              )}
              {dueBadge && (
                <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-medium ${dueBadge.className}`}>
                  {dueBadge.text}
                </span>
              )}
              {task.assignee && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                  <User className="h-3 w-3" />
                  {task.assignee}
                </span>
              )}
            </div>
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
      </div>

      <details className="ml-8 group">
        <summary className="flex w-fit cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-teal-600">
          <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
          詳細を見る
        </summary>
        <div className="mt-1.5 flex flex-col gap-1.5 text-xs text-slate-500">
          {task.notes && <p className="whitespace-pre-wrap">{task.notes}</p>}
          {task.link_url && (
            <a
              href={task.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-teal-600 underline hover:text-teal-700"
            >
              {task.link_url}
            </a>
          )}
          <p className="text-slate-400">作成日時: {formatDateTime(task.created_at)}</p>
          <p className="text-slate-400">更新日時: {formatDateTime(task.updated_at)}</p>
        </div>
      </details>
    </li>
  );
}
