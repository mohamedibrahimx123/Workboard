import { Suspense } from "react";
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
      className="flex items-center gap-2 rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300"
    >
      <svg
        className="h-4 w-4 shrink-0 text-red-400"
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-400">WORKBOARD</p>
          <h1 className="mt-3 text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your tasks.
          </p>
        </div>

        <form action={login} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
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
      </section>
    </main>
  );
}