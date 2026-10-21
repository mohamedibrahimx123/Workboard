"use client";

import { useState } from "react";
import { updateTask, deleteTask } from "./actions";
import SubmitButton from "./SubmitButton";
import DeleteButton from "./DeleteButton";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  created_at: string;
};

type TaskListProps = {
  tasks: Task[];
  currentPage?: number;
};

type StatusFilter = "all" | Task["status"];
type PriorityFilter = "all" | Task["priority"];
type SortOption = "newest" | "oldest" | "priority" | "due_date";

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

export default function TaskList({ tasks, currentPage }: TaskListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredTasks = tasks
    .filter((task) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.created_at.localeCompare(b.created_at);

        case "priority":
          return priorityOrder[b.priority] - priorityOrder[a.priority];

        case "due_date":
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);

        case "newest":
        default:
          return b.created_at.localeCompare(a.created_at);
      }
    });

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label
          htmlFor="task-search"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Search Tasks
        </label>

        <div className="relative">
          <input
            id="task-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or description..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 pl-11 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Filter by Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority-filter"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Filter by Priority
          </label>

          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as PriorityFilter)
            }
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-by"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Sort By
          </label>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest Priority</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 pb-3 text-sm">
        <p className="text-zinc-400">
          Showing <span className="font-medium text-zinc-200">{filteredTasks.length}</span> of{" "}
          <span className="font-medium text-zinc-200">{tasks.length}</span> tasks on this page
        </p>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setPriorityFilter("all");
            setSortBy("newest");
          }}
          className="font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-14 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-500">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-zinc-200">No matching tasks</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Try adjusting your search query or reset active filters.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-sm transition hover:border-zinc-700/80"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2">
                  {/* Status Indicator Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      task.status === "completed"
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : task.status === "in_progress"
                        ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border border-zinc-700 bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        task.status === "completed"
                          ? "bg-emerald-400"
                          : task.status === "in_progress"
                          ? "bg-amber-400"
                          : "bg-zinc-400"
                      }`}
                    />
                    {task.status.replace("_", " ")}
                  </span>

                  {/* Priority Indicator Pill */}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      task.priority === "high"
                        ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                        : task.priority === "medium"
                        ? "border border-amber-500/20 bg-amber-500/5 text-amber-300"
                        : "border border-zinc-700/60 bg-zinc-800/40 text-zinc-400"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                {task.due_date && (
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Due {task.due_date}
                  </span>
                )}
              </div>

              <form action={updateTask} className="space-y-4">
                <input type="hidden" name="id" value={task.id} />
                {currentPage ? (
                  <input type="hidden" name="page" value={currentPage} />
                ) : null}

                <div>
                  <label
                    htmlFor={`title-${task.id}`}
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
                  >
                    Task Title
                  </label>

                  <input
                    id={`title-${task.id}`}
                    name="title"
                    type="text"
                    required
                    maxLength={200}
                    defaultValue={task.title}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 font-medium text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`description-${task.id}`}
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
                  >
                    Description
                  </label>

                  <textarea
                    id={`description-${task.id}`}
                    name="description"
                    rows={2}
                    maxLength={5000}
                    defaultValue={task.description ?? ""}
                    className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor={`status-${task.id}`}
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
                    >
                      Status
                    </label>

                    <select
                      id={`status-${task.id}`}
                      name="status"
                      defaultValue={task.status}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`priority-${task.id}`}
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
                    >
                      Priority
                    </label>

                    <select
                      id={`priority-${task.id}`}
                      name="priority"
                      defaultValue={task.priority}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`due-date-${task.id}`}
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
                    >
                      Due Date
                    </label>

                    <input
                      id={`due-date-${task.id}`}
                      name="due_date"
                      type="date"
                      defaultValue={task.due_date ?? ""}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <SubmitButton
                    label="Update Task"
                    pendingLabel="Saving..."
                    variant="primary"
                  />
                </div>
              </form>

              <form action={deleteTask} className="mt-3 flex justify-end">
                <input type="hidden" name="id" value={task.id} />
                {currentPage ? (
                  <input type="hidden" name="page" value={currentPage} />
                ) : null}

                <DeleteButton />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
