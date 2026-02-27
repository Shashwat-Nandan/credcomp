import { Metadata } from "next";
import { getAllCards, getCardBySlug } from "@/lib/cards";
import { parseComparisonSlugs } from "@/lib/compare";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { CompareShare } from "@/components/compare/CompareShare";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "Compare Credit Cards Side-by-Side",
  description:
    "Compare up to 3 Indian credit cards side-by-side. Evaluate fees, rewards, lounge access, and benefits to find the best card for you.",
  path: "/compare",
});

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const cardsParam = typeof params.cards === "string" ? params.cards : null;
  const slugs = parseComparisonSlugs(cardsParam);

  const allCards = getAllCards();
  const selectedCards = slugs
    .map((slug) => getCardBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const cardOptions = allCards.map((c) => ({
    slug: c.slug,
    name: c.name,
    issuer: c.issuer,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Compare Cards", href: "/compare" }]} />

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
        <Suspense fallback={null}>
          <CompareSelector cards={cardOptions} initialSlugs={slugs} />
        </Suspense>
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
    </div>
  );
}
