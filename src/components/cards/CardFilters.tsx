"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { TIER_LABELS, NETWORK_LABELS } from "@/lib/constants";

const CATEGORIES = [
  { value: "travel", label: "Travel" },
  { value: "cashback", label: "Cashback" },
  { value: "rewards", label: "Rewards" },
  { value: "premium", label: "Premium" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "fuel", label: "Fuel" },
  { value: "lounge", label: "Lounge Access" },
  { value: "no-annual-fee", label: "No Annual Fee" },
];

const ISSUERS = [
  { value: "hdfc", label: "HDFC Bank" },
  { value: "sbi", label: "SBI Card" },
  { value: "icici", label: "ICICI Bank" },
  { value: "axis", label: "Axis Bank" },
  { value: "amex", label: "Amex" },
  { value: "idfc", label: "IDFC FIRST" },
  { value: "au", label: "AU Bank" },
];

export function CardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentIssuer = searchParams.get("issuer") || "";
  const currentNetwork = searchParams.get("network") || "";
  const currentTier = searchParams.get("tier") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasFilters = currentCategory || currentIssuer || currentNetwork || currentTier;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-primary)]">Filters</h2>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-[var(--color-accent)] hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <FilterSelect
          label="Category"
          value={currentCategory}
          options={CATEGORIES}
          onChange={(v) => updateFilter("category", v)}
        />
        <FilterSelect
          label="Issuer"
          value={currentIssuer}
          options={ISSUERS}
          onChange={(v) => updateFilter("issuer", v)}
        />
        <FilterSelect
          label="Network"
          value={currentNetwork}
          options={Object.entries(NETWORK_LABELS).map(([value, label]) => ({ value, label }))}
          onChange={(v) => updateFilter("network", v)}
        />
        <FilterSelect
          label="Tier"
          value={currentTier}
          options={Object.entries(TIER_LABELS).map(([value, label]) => ({ value, label }))}
          onChange={(v) => updateFilter("tier", v)}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
