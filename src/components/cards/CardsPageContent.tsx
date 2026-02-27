"use client";

import { useSearchParams } from "next/navigation";
import { CreditCard } from "@/types";
import { CardGrid } from "./CardGrid";
import { CardFilters } from "./CardFilters";

interface CardsPageContentProps {
  allCards: CreditCard[];
}

export function CardsPageContent({ allCards }: CardsPageContentProps) {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const issuer = searchParams.get("issuer") || "";
  const network = searchParams.get("network") || "";
  const tier = searchParams.get("tier") || "";

  let filtered = allCards;
  if (category) filtered = filtered.filter((c) => c.categories.includes(category));
  if (issuer) filtered = filtered.filter((c) => c.issuer === issuer);
  if (network) filtered = filtered.filter((c) => c.network === network);
  if (tier) filtered = filtered.filter((c) => c.tier === tier);

  return (
    <>
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">All Credit Cards</h1>
      <p className="mt-2 text-gray-500">
        {filtered.length} card{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="mt-6">
        <CardFilters />
      </div>

      <div className="mt-6">
        <CardGrid cards={filtered} emptyMessage="No cards match your filters. Try adjusting them." />
      </div>
    </>
  );
}
