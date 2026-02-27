import { Metadata } from "next";
import { getAllCards } from "@/lib/cards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd, buildMetadata } from "@/lib/seo";
import { CardsPageContent } from "@/components/cards/CardsPageContent";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "All Credit Cards",
  description:
    "Browse and compare all Indian credit cards. Filter by issuer, category, network, and tier to find the perfect card.",
  path: "/cards",
});

export default function CardsPage() {
  const allCards = getAllCards();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildItemListJsonLd(allCards, "All Credit Cards in India")} />
      <Breadcrumbs items={[{ label: "All Cards", href: "/cards" }]} />

      <Suspense fallback={<CardsPageSkeleton />}>
        <CardsPageContent allCards={allCards} />
      </Suspense>
    </div>
  );
}

function CardsPageSkeleton() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">All Credit Cards</h1>
      <p className="mt-2 text-gray-500">Loading cards...</p>
      <div className="mt-6 h-12 animate-pulse rounded-lg bg-surface-muted" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
