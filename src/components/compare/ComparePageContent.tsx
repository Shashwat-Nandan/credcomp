"use client";

import { useSearchParams } from "next/navigation";
import { CreditCard } from "@/types";
import { parseComparisonSlugs } from "@/lib/compare";
import { CompareSelector } from "./CompareSelector";
import { ComparisonTable } from "./ComparisonTable";
import { CompareShare } from "./CompareShare";

interface ComparePageContentProps {
  allCards: CreditCard[];
}

export function ComparePageContent({ allCards }: ComparePageContentProps) {
  const searchParams = useSearchParams();
  const cardsParam = searchParams.get("cards");
  const slugs = parseComparisonSlugs(cardsParam);

  const cardsBySlug = new Map(allCards.map((c) => [c.slug, c]));
  const selectedCards = slugs
    .map((slug) => cardsBySlug.get(slug))
    .filter((c): c is CreditCard => c !== undefined);

  const cardOptions = allCards.map((c) => ({
    slug: c.slug,
    name: c.name,
    issuer: c.issuer,
  }));

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Compare Credit Cards</h1>
          <p className="mt-2 text-gray-500">
            Select 2-3 cards to compare side-by-side
          </p>
        </div>
        {selectedCards.length >= 2 && <CompareShare />}
      </div>

      <div className="mt-6">
        <CompareSelector cards={cardOptions} initialSlugs={slugs} />
      </div>

      {selectedCards.length >= 2 && (
        <div className="mt-8">
          <ComparisonTable cards={selectedCards} />
        </div>
      )}

      {selectedCards.length < 2 && slugs.length > 0 && (
        <p className="mt-8 text-center text-gray-500">
          Please select at least 2 valid cards to compare.
        </p>
      )}
    </>
  );
}
