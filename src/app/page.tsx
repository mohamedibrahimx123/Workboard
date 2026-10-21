import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Background ambient radial gradients */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between border-b border-zinc-800/60 px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 font-mono text-sm font-black text-zinc-950 shadow-md shadow-emerald-500/20">
            W
          </span>
          <span className="text-sm font-bold tracking-widest text-white">
            WORKBOARD
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
          <a href="#features" className="transition hover:text-emerald-400">
            Features
          </a>
          <a href="#architecture" className="transition hover:text-emerald-400">
            Architecture
          </a>
          <a href="#workflow" className="transition hover:text-emerald-400">
            CI/CD Workflow
          </a>
          <a
            href="https://github.com/mohamedibrahimx123/Workboard"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-emerald-400"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-700 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 shadow-sm shadow-emerald-500/10">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Next.js 16 + React 19 + Supabase Architecture
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Orchestrate Tasks with{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              Enterprise Velocity
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            A production-ready task management platform built for modern engineering teams.
            Featuring database-level pagination, secure server actions, and corporate CI/CD review workflows.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-base font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Get Started Free
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-7 py-3.5 text-base font-semibold text-zinc-200 transition hover:border-zinc-700 hover:text-white"
            >
              Explore Dashboard
            </Link>
          </div>

          {/* Key Value Pills */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Database-level Pagination (.range)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Zero Information Leaks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Automated CI/CD Checks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Row Level Security (RLS)
            </span>
          </div>

          {/* Interactive UI Mockup Showcase */}
          <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-zinc-500">workboard.internal/dashboard</span>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Live Backlog
              </span>
            </div>

            {/* Simulated Cards */}
            <div className="grid gap-3 text-left">
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                      COMPLETED
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-400">
                      High Priority
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-white">
                    Setup Database-level Pagination with Supabase .range()
                  </h4>
                </div>
                <span className="text-xs font-medium text-emerald-400">✓ Done</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                      IN PROGRESS
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-400">
                      Medium Priority
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-white">
                    Corporate CI Workflow & Branch Protection Setup
                  </h4>
                </div>
                <span className="text-xs font-medium text-amber-400">⏳ Active</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-bold text-zinc-400">
                      TO DO
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-400">
                      Low Priority
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-white">
                    Deploy staging preview on Vercel with feature branch
                  </h4>
                </div>
                <span className="text-xs font-medium text-zinc-500">Scheduled</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Architectural Excellence
            </h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Engineered for Real-World Scalability
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Built according to enterprise conventions, solving bottlenecks before they occur.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-sm transition hover:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Database-Level Pagination</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Instead of fetching thousands of records into client memory, Supabase <code className="text-emerald-400">.range()</code> queries exact 5-item slices directly from Postgres.
              </p>
            </article>

            {/* Feature 2 */}
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-sm transition hover:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Zero Information Leaks</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Server Actions wrap errors securely. Database schemas, Postgres error codes, and sensitive traces stay in server logs and never reach client screens.
              </p>
            </article>

            {/* Feature 3 */}
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-sm transition hover:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Pending States & Guards</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                React 19 <code className="text-emerald-400">useFormStatus</code> powers animated spinners and auto-disables submit buttons, preventing accidental duplicate writes.
              </p>
            </article>

            {/* Feature 4 */}
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-sm transition hover:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Row Level Security (RLS)</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Strict PostgreSQL RLS policies guarantee multi-tenant security. Users cannot view, modify, or delete any task outside their own authenticated account.
              </p>
            </article>

            {/* Feature 5 */}
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-sm transition hover:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Next.js 16 Proxy Convention</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Adopts the official Next.js 16 <code className="text-emerald-400">proxy.ts</code> convention for lightweight session refresh and boundary protection.
              </p>
            </article>

            {/* Feature 6 */}
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-sm transition hover:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Automated CI/CD Pipeline</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                GitHub Actions enforces strict quality gates: ESLint, TypeScript check, Vitest unit tests, and production build verification on every Pull Request.
              </p>
            </article>
          </div>
        </section>

        {/* Corporate Workflow Section */}
        <section id="workflow" className="mx-auto max-w-5xl px-6 py-20 border-t border-zinc-800/60">
          <div className="rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-8 sm:p-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Corporate Git Strategy
            </h2>
            <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              How Enterprise Teams Ship with Workboard
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Simulating production-grade delivery with trunk-based branching, automated CI validation, and Senior developer reviews.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <span className="font-mono text-xs font-bold text-emerald-400">STEP 01</span>
                <h4 className="mt-2 font-semibold text-white">Feature Branch (`dev`)</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Engineers write code and push freely to <code className="text-zinc-200">dev</code> without CI blocking work-in-progress.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <span className="font-mono text-xs font-bold text-emerald-400">STEP 02</span>
                <h4 className="mt-2 font-semibold text-white">Pull Request to `main`</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Opening a PR triggers GitHub Actions to run Lint, Typecheck, Tests, and Next.js Build automatically.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <span className="font-mono text-xs font-bold text-emerald-400">STEP 03</span>
                <h4 className="mt-2 font-semibold text-white">Senior Code Review</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Once CI checks turn green, the Senior Developer reviews and merges the PR into production.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to organize your engineering tasks?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Sign in to start creating, organizing, and tracking your tasks with enterprise velocity today.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              Sign In to Workboard
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/60 bg-zinc-950 px-6 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 font-mono text-[10px] font-black text-zinc-950">
              W
            </span>
            <span className="font-semibold text-zinc-400">WORKBOARD</span>
            <span>• Next.js 16 Enterprise Platform</span>
          </div>

          <p>
            Developed by{" "}
            <a
              href="https://github.com/mohamedibrahimx123"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-400 transition hover:text-emerald-400"
            >
              Mohamed Ibrahim
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
