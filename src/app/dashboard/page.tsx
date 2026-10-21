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
      className={`mt-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm transition ${
        isError
          ? "border-red-900/60 bg-red-950/40 text-red-200"
          : "border-emerald-900/60 bg-emerald-950/40 text-emerald-200"
      }`}
    >
      {isError ? (
        <svg
          className="h-5 w-5 shrink-0 text-red-400"
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
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-cyan-400">
              WORKBOARD
            </p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-slate-400">Welcome back, {user.email}</p>
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
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Tasks</p>
            <p className="mt-3 text-3xl font-bold">{totalTasks}</p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">In Progress</p>
            <p className="mt-3 text-3xl font-bold">{inProgressTasks}</p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-3 text-3xl font-bold">{completedTasks}</p>
          </article>
        </section>

        {/* Create Task Form */}
        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Create a Task</h2>
          <p className="mt-2 text-sm text-slate-400">
            Add a new task to your workspace.
          </p>

          <form action={createTask} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Task title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
                placeholder="e.g. Finish the React project"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={5000}
                placeholder="Add task details..."
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-medium"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue="medium"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="due_date"
                  className="mb-2 block text-sm font-medium"
                >
                  Due date
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>
            </div>

            {/* SubmitButton with loading/pending state and duplicate click prevention */}
            <SubmitButton
              label="Create Task"
              pendingLabel="Creating task..."
              variant="primary"
            />
          </form>
        </section>

        {/* Task List & Pagination Section */}
        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <p className="mt-1 text-sm text-slate-400">
                Manage, update, and organize your tasks.
              </p>
            </div>
            <div className="text-xs text-slate-400 sm:text-right">
              Page <span className="font-semibold text-slate-200">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-200">{totalPages}</span>
            </div>
          </div>

          {tasksError ? (
            <div
              role="alert"
              className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300"
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
