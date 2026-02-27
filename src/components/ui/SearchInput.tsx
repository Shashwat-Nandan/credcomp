"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with controlled value when it changes externally
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  function handleChange(nextValue: string) {
    setInternalValue(nextValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(nextValue);
    }, 300);
  }

  function handleClear() {
    setInternalValue("");
    onChange("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={clsx("relative", className)}>
      {/* Magnifying glass icon */}
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>

      <input
        type="text"
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-lg border border-surface-border bg-surface py-2 pl-10 pr-9",
          "text-sm text-text placeholder:text-text-muted",
          "transition-colors duration-150",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        )}
      />

      {/* Clear button */}
      {internalValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-accent cursor-pointer"
          aria-label="Clear search"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
