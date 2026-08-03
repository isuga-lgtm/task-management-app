import Image from "next/image";
import { signIn, signUp } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <Image
          src="/logo.png"
          alt="on call"
          width={160}
          height={40}
          className="mx-auto mb-6 h-8 w-auto"
        />
        <h1 className="mb-6 text-center text-xl font-semibold text-zinc-900">
          タスク管理アプリ
        </h1>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            formAction={signIn}
            className="rounded-md bg-[#00AEC7] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0090a6]"
          >
            ログイン
          </button>
          <button
            formAction={signUp}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            新規登録
          </button>
        </form>
      </div>
    </div>
  );
}
