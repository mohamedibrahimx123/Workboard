"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1 && totalCount <= pageSize) {
    return (
      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <p>
          Showing {totalCount} {totalCount === 1 ? "task" : "tasks"}
        </p>
      </div>
    );
  }

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    params.delete("success");
    params.delete("error");
    return `${pathname}?${params.toString()}`;
  };

  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 1; // Number of pages before and after current
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
      <p className="text-sm text-slate-400">
        Showing <span className="font-semibold text-slate-200">{startIndex}</span> -{" "}
        <span className="font-semibold text-slate-200">{endIndex}</span> of{" "}
        <span className="font-semibold text-slate-200">{totalCount}</span> tasks
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        {/* Previous Button */}
        {currentPage <= 1 ? (
          <span
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Previous</span>
          </span>
        ) : (
          <Link
            href={createPageURL(currentPage - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Previous</span>
          </Link>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-slate-600"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isCurrent = pageNum === currentPage;

            return isCurrent ? (
              <span
                key={pageNum}
                aria-current="page"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 font-semibold text-slate-950"
              >
                {pageNum}
              </span>
            ) : (
              <Link
                key={pageNum}
                href={createPageURL(pageNum)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage >= totalPages ? (
          <span
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-600"
          >
            <span>Next</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        ) : (
          <Link
            href={createPageURL(currentPage + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <span>Next</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
