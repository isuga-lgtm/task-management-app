"use client";

import { useRef, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { addTask } from "@/app/actions";

export default function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addTask(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
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
          disabled={isPending}
          className="h-10 rounded-lg bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "追加中…" : "追加"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

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
  );
}
