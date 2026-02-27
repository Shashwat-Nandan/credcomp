import { Metadata } from "next";
import { getAllCards } from "@/lib/cards";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardFilters } from "@/components/cards/CardFilters";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd, buildMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "All Credit Cards",
  description:
    "Browse and compare all Indian credit cards. Filter by issuer, category, network, and tier to find the perfect card.",
  path: "/cards",
});

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const allCards = getAllCards();

  const category = typeof params.category === "string" ? params.category : "";
  const issuer = typeof params.issuer === "string" ? params.issuer : "";
  const network = typeof params.network === "string" ? params.network : "";
  const tier = typeof params.tier === "string" ? params.tier : "";

  let filtered = allCards;
  if (category) filtered = filtered.filter((c) => c.categories.includes(category));
  if (issuer) filtered = filtered.filter((c) => c.issuer === issuer);
  if (network) filtered = filtered.filter((c) => c.network === network);
  if (tier) filtered = filtered.filter((c) => c.tier === tier);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildItemListJsonLd(filtered, "All Credit Cards in India")} />
      <Breadcrumbs items={[{ label: "All Cards", href: "/cards" }]} />

      <h1 className="text-3xl font-bold text-[var(--color-primary)]">All Credit Cards</h1>
      <p className="mt-2 text-gray-500">
        {filtered.length} card{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <CardFilters />
        </Suspense>
      </div>

      <div className="mt-6">
        <CardGrid cards={filtered} emptyMessage="No cards match your filters. Try adjusting them." />
      </div>
    </div>
  );
}
