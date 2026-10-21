import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createTask } from "./actions";
import { logout } from "@/app/auth/actions";
import TaskList from "./TaskList";
import Pagination from "./Pagination";
import SubmitButton from "./SubmitButton";

type DashboardSearchParams = {
  page?: string;
  success?: string;
  error?: string;
};

export const instant = false;

const PAGE_SIZE = 5;

async function DashboardFeedback({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const params = await searchParams;

  const messages: Record<string, string> = {
    task_created: "تم إنشاء المهمة بنجاح.",
    task_updated: "تم حفظ التعديلات بنجاح.",
    task_deleted: "تم حذف المهمة بنجاح.",
  };

  const errorMessages: Record<string, string> = {
    invalid_input: "البيانات المدخلة غير صحيحة. يرجى التأكد من ملء الحقول المطلوبة.",
    task_create_failed: "تعذّر إنشاء المهمة. يرجى المحاولة مرة أخرى.",
    task_update_failed: "تعذّر حفظ التعديلات. يرجى المحاولة مرة أخرى.",
    task_delete_failed: "تعذّر حذف المهمة. يرجى المحاولة مرة أخرى.",
    task_not_found: "المهمة غير موجودة أو تم حذفها بالفعل.",
    server_error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقاً.",
    unauthorized: "انتهت جلستك، يرجى تسجيل الدخول مجدداً.",
  };

  const successMessage = params.success ? messages[params.success] : undefined;
  const errorMessage = params.error ? errorMessages[params.error] : undefined;

  if (!successMessage && !errorMessage) {
    return null;
  }

  const isError = Boolean(errorMessage);

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live="polite"
      className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium shadow-sm transition ${
        isError
          ? "border-rose-900/60 bg-rose-950/40 text-rose-200"
          : "border-emerald-900/60 bg-emerald-950/40 text-emerald-200"
      }`}
    >
      {isError ? (
        <svg
          className="h-5 w-5 shrink-0 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 shrink-0 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>{errorMessage ?? successMessage}</span>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  // 1. Authenticate user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Database-level pagination calculation
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 3. Query Supabase for the current page slice using .range() and exact count
  const {
    data: tasks,
    count,
    error: tasksError,
  } = await supabase
    .from("tasks")
    .select(
      "id, title, description, status, priority, due_date, created_at",
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (tasksError) {
    console.error("[Database Error] Failed to load paginated tasks:", {
      code: tasksError.code,
      message: tasksError.message,
      timestamp: new Date().toISOString(),
    });
  }

  // 4. Fetch lightweight status summary for overall stats counter
  const { data: statusSummary } = await supabase
    .from("tasks")
    .select("status")
    .eq("user_id", user.id);

  const totalTasks = count ?? statusSummary?.length ?? 0;
  const inProgressTasks =
    statusSummary?.filter((t) => t.status === "in_progress").length ?? 0;
  const completedTasks =
    statusSummary?.filter((t) => t.status === "completed").length ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));
  const taskList = tasks ?? [];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      {/* Background ambient light */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 font-mono text-xs font-black text-zinc-950">
                W
              </span>
              <p className="text-xs font-bold tracking-widest text-emerald-400">
                WORKBOARD
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Task Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Welcome back, <span className="font-medium text-zinc-200">{user.email}</span>
            </p>
          </div>

          <form action={logout}>
            <SubmitButton
              label="Sign out"
              pendingLabel="Signing out..."
              variant="outline"
            />
          </form>
        </header>

        {/* Feedback Alert */}
        <Suspense fallback={null}>
          <DashboardFeedback searchParams={searchParams} />
        </Suspense>

        {/* Task Statistics */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Total Tasks</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">{totalTasks}</p>
            <p className="mt-1 text-xs text-zinc-500">Across all projects</p>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">In Progress</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-amber-300">{inProgressTasks}</p>
            <p className="mt-1 text-xs text-zinc-500">Currently active</p>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Completed</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-emerald-400">{completedTasks}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completion rate` : "No tasks yet"}
            </p>
          </article>
        </section>

        {/* Create Task Form */}
        <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Create a Task</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Add a new actionable item to your workspace.
            </p>
          </div>

          <form action={createTask} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Task title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
                placeholder="e.g. Implement authentication middleware"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={5000}
                placeholder="Add relevant notes, checklist items, or acceptance criteria..."
                className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue="medium"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="due_date"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Due date
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <SubmitButton
              label="Create Task"
              pendingLabel="Creating task..."
              variant="primary"
            />
          </form>
        </section>

        {/* Task List & Pagination Section */}
        <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-white">My Tasks</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Search, filter, update, and manage your backlog.
              </p>
            </div>
            <div className="text-xs text-zinc-400 sm:text-right">
              Page <span className="font-semibold text-zinc-200">{currentPage}</span> of{" "}
              <span className="font-semibold text-zinc-200">{totalPages}</span>
            </div>
          </div>

          {tasksError ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-4 text-sm text-rose-300"
            >
              تعذّر تحميل المهام حالياً. يرجى المحاولة مرة أخرى لاحقاً.
            </div>
          ) : (
            <>
              <TaskList tasks={taskList} currentPage={currentPage} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalTasks}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
