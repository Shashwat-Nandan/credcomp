"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "@/types";

export function CardSearch({ cards }: { cards: CreditCard[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CreditCard[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const lower = q.toLowerCase();
      const matched = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.issuer.toLowerCase().includes(lower) ||
          c.categories.some((cat) => cat.includes(lower))
      );
      setResults(matched.slice(0, 6));
    },
    [cards]
  );

  const handleChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    search(value);
    setIsOpen(true);
  };

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/cards/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Search credit cards..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-gray-400 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {results.map((card, i) => (
            <li
              key={card.slug}
              role="option"
              aria-selected={i === selectedIndex}
              className={`cursor-pointer px-4 py-2.5 text-sm ${
                i === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={() => handleSelect(card.slug)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <div className="font-medium">{card.name}</div>
              <div className="text-xs text-gray-400">{card.issuer.toUpperCase()} &middot; {card.tier}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
