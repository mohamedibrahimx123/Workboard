
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
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredTasks = tasks
    .filter((task) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.created_at.localeCompare(b.created_at);

        case "priority":
          return priorityOrder[b.priority] -
            priorityOrder[a.priority];

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
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label
          htmlFor="task-search"
          className="mb-2 block text-sm font-medium"
        >
          Search Tasks
        </label>

        <input
          id="task-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or description..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
        />
      </div>

      {/* Filters and Sorting */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium"
          >
            Filter by Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3"
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
            className="mb-2 block text-sm font-medium"
          >
            Filter by Priority
          </label>

          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as PriorityFilter)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-by"
            className="mb-2 block text-sm font-medium"
          >
            Sort By
          </label>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest Priority</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setPriorityFilter("all");
            setSortBy("newest");
          }}
          className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 px-4 py-12 text-center">
          <h3 className="font-medium">No matching tasks</h3>
          <p className="mt-2 text-sm text-slate-400">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
            >
              <form action={updateTask} className="space-y-5">
                <input
                  type="hidden"
                  name="id"
                  value={task.id}
                />
                {currentPage ? (
                  <input
                    type="hidden"
                    name="page"
                    value={currentPage}
                  />
                ) : null}

                <div>
                  <label
                    htmlFor={`title-${task.id}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    Title
                  </label>

                  <input
                    id={`title-${task.id}`}
                    name="title"
                    type="text"
                    required
                    maxLength={200}
                    defaultValue={task.title}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`description-${task.id}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    Description
                  </label>

                  <textarea
                    id={`description-${task.id}`}
                    name="description"
                    rows={2}
                    maxLength={5000}
                    defaultValue={task.description ?? ""}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor={`status-${task.id}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      Status
                    </label>

                    <select
                      id={`status-${task.id}`}
                      name="status"
                      defaultValue={task.status}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`priority-${task.id}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      Priority
                    </label>

                    <select
                      id={`priority-${task.id}`}
                      name="priority"
                      defaultValue={task.priority}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`due-date-${task.id}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      Due Date
                    </label>

                    <input
                      id={`due-date-${task.id}`}
                      name="due_date"
                      type="date"
                      defaultValue={task.due_date ?? ""}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3"
                    />
                  </div>
                </div>

                <SubmitButton label="Update Task" pendingLabel="Saving..." />
              </form>

              <form action={deleteTask} className="mt-3">
                <input
                  type="hidden"
                  name="id"
                  value={task.id}
                />
                {currentPage ? (
                  <input
                    type="hidden"
                    name="page"
                    value={currentPage}
                  />
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
