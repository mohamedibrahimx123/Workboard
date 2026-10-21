import { Suspense } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import SubmitButton from "@/app/dashboard/SubmitButton";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

type LoginErrorProps = {
  searchParams: LoginPageProps["searchParams"];
};

async function LoginErrorMessage({ searchParams }: LoginErrorProps) {
  const { error } = await searchParams;

  let errorMessage = "";

  if (error === "invalid_input") {
    errorMessage = "Please enter a valid email and password.";
  } else if (error === "invalid_credentials") {
    errorMessage = "Invalid email or password.";
  } else if (error === "email_not_confirmed") {
    errorMessage =
      "Email not confirmed. Please confirm your email in Supabase dashboard.";
  } else if (error === "server_error") {
    errorMessage = "Server error occurred. Please try again later.";
  }

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 rounded-xl border border-rose-900/60 bg-rose-950/40 p-3.5 text-sm font-medium text-rose-300"
    >
      <svg
        className="h-4 w-4 shrink-0 text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{errorMessage}</span>
    </div>
  );
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),rgba(0,0,0,0)_60%)]" />

      <section className="relative w-full max-w-md rounded-3xl border border-zinc-800/80 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 transition hover:text-emerald-300"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 font-mono text-xs font-black text-zinc-950">
              W
            </span>
            WORKBOARD
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sign in to manage and accelerate your tasks.
          </p>
        </div>

        <form action={login} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter your password"
            />
          </div>

          <Suspense fallback={null}>
            <LoginErrorMessage searchParams={searchParams} />
          </Suspense>

          <SubmitButton
            label="Sign in"
            pendingLabel="Signing in..."
            className="w-full py-3"
            variant="primary"
          />
        </form>

        <div className="mt-8 border-t border-zinc-800/60 pt-6 text-center text-xs text-zinc-500">
          <Link
            href="/"
            className="text-zinc-400 transition hover:text-emerald-400"
          >
            ← Back to Homepage
          </Link>
        </div>
      </section>
    </main>
  );
}