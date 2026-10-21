"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label?: string;
  pendingLabel?: string;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
};

export default function SubmitButton({
  label = "Save",
  pendingLabel = "Saving...",
  className = "",
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const variantStyles = {
    primary:
      "bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 focus-visible:ring-emerald-400 shadow-sm shadow-emerald-950/50",
    secondary:
      "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:ring-zinc-600 border border-zinc-700/60",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-400 shadow-sm shadow-rose-950/50",
    outline:
      "border border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500 hover:text-white focus-visible:ring-zinc-500",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium transition focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    >
      {pending && (
        <svg
          className="h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}
