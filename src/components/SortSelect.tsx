"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
    >
      <option value="default">並び替え: 標準</option>
      <option value="due">期限が近い順</option>
      <option value="priority">優先度が高い順</option>
    </select>
  );
}
