"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { getComparisonUrl } from "@/lib/compare";
import { getIssuerDisplayName } from "@/lib/utils";

interface CardOption {
  slug: string;
  name: string;
  issuer: string;
}

interface CompareSelectorProps {
  cards: CardOption[];
  initialSlugs?: string[];
}

const MAX_CARDS = 3;
const MIN_CARDS = 2;

export function CompareSelector({ cards, initialSlugs = [] }: CompareSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<CardOption[]>(() =>
    initialSlugs
      .map((slug) => cards.find((c) => c.slug === slug))
      .filter((c): c is CardOption => c !== undefined)
  );
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = cards.filter(
    (card) =>
      !selected.some((s) => s.slug === card.slug) &&
      (card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.issuer.toLowerCase().includes(query.toLowerCase()))
  );

  const canCompare = selected.length >= MIN_CARDS;
  const canAdd = selected.length < MAX_CARDS;

  const handleSelect = useCallback(
    (card: CardOption) => {
      if (!canAdd) return;
      setSelected((prev) => [...prev, card]);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [canAdd]
  );

  function handleRemove(slug: string) {
    setSelected((prev) => prev.filter((c) => c.slug !== slug));
  }

  function handleCompare() {
    if (!canCompare) return;
    const slugs = selected.map((c) => c.slug);
    router.push(getComparisonUrl(slugs));
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" && filtered.length === 1) {
      handleSelect(filtered[0]);
    }
    if (
      e.key === "Backspace" &&
      query === "" &&
      selected.length > 0
    ) {
      setSelected((prev) => prev.slice(0, -1));
    }
  }

  return (
    <div className="space-y-4">
      {/* Selected cards as chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((card) => (
            <span
              key={card.slug}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent"
            >
              <span>{card.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(card.slug)}
                className="rounded-full p-0.5 transition-colors hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-accent cursor-pointer"
                aria-label={`Remove ${card.name}`}
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
            </span>
          ))}
        </div>
      )}

      {/* Search dropdown */}
      <div ref={containerRef} className="relative">
        <div className="relative">
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              canAdd
                ? `Search cards to compare (${selected.length}/${MAX_CARDS} selected)...`
                : "Maximum cards selected"
            }
            disabled={!canAdd}
            className={clsx(
              "w-full rounded-lg border border-surface-border bg-surface py-2.5 pl-10 pr-4",
              "text-sm text-text placeholder:text-text-muted",
              "transition-colors duration-150",
              "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>

        {/* Dropdown */}
        {isOpen && canAdd && (
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-surface-border bg-surface shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-muted">
                No cards found
              </div>
            ) : (
              <ul role="listbox">
                {filtered.slice(0, 20).map((card) => (
                  <li key={card.slug}>
                    <button
                      type="button"
                      onClick={() => handleSelect(card)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted cursor-pointer"
                      role="option"
                      aria-selected={false}
                    >
                      <span className="font-medium text-text">
                        {card.name}
                      </span>
                      <span className="text-text-muted">
                        {getIssuerDisplayName(card.issuer)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Compare button */}
      <button
        type="button"
        onClick={handleCompare}
        disabled={!canCompare}
        className={clsx(
          "inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "cursor-pointer",
          canCompare
            ? "bg-accent text-white shadow-sm hover:bg-accent-light active:shadow-none"
            : "cursor-not-allowed bg-gray-100 text-gray-400"
        )}
      >
        Compare {selected.length > 0 ? `(${selected.length})` : ""}
      </button>

      {selected.length === 1 && (
        <p className="text-xs text-text-muted">
          Select at least one more card to compare.
        </p>
      )}
    </div>
  );
}
