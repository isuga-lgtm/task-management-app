import Image from "next/image";
import Link from "next/link";
import { signIn, signUp } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; mode?: string }>;
}) {
  const { error, message, mode } = await searchParams;
  const isSignUp = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white bg-white/90 p-8 shadow-[0_4px_20px_-4px_rgba(15,118,110,0.15)] backdrop-blur">
        <Image
          src="/logo.png"
          alt="on call"
          width={240}
          height={60}
          className="mx-auto mb-6 h-14 w-auto"
        />

        <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1">
          <Link
            href="/login?mode=signin"
            className={`flex-1 rounded-md py-1.5 text-center text-sm font-medium transition ${
              !isSignUp ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            ログイン
          </Link>
          <Link
            href="/login?mode=signup"
            className={`flex-1 rounded-md py-1.5 text-center text-sm font-medium transition ${
              isSignUp ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            新規登録
          </Link>
        </div>

        <h1 className="mb-6 text-center text-xl font-semibold text-slate-800">
          {isSignUp ? "新規登録" : "ログイン"}
        </h1>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-slate-500">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-slate-500">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700">
              {message}
            </p>
          )}

          {isSignUp ? (
            <button
              formAction={signUp}
              className="h-10 rounded-lg bg-teal-600 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md active:scale-[0.98]"
            >
              新規登録する
            </button>
          ) : (
            <button
              formAction={signIn}
              className="h-10 rounded-lg bg-teal-600 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md active:scale-[0.98]"
            >
              ログインする
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
