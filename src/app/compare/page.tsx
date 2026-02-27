import { Metadata } from "next";
import { getAllCards } from "@/lib/cards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparePageContent } from "@/components/compare/ComparePageContent";
import { buildMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "Compare Credit Cards Side-by-Side",
  description:
    "Compare up to 3 Indian credit cards side-by-side. Evaluate fees, rewards, lounge access, and benefits to find the best card for you.",
  path: "/compare",
});

export default function ComparePage() {
  const allCards = getAllCards();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Compare Cards", href: "/compare" }]} />

      <Suspense fallback={<ComparePageSkeleton />}>
        <ComparePageContent allCards={allCards} />
      </Suspense>
    </div>
  );
}

function ComparePageSkeleton() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Compare Credit Cards</h1>
      <p className="mt-2 text-gray-500">Select 2-3 cards to compare side-by-side</p>
      <div className="mt-6 h-12 animate-pulse rounded-lg bg-surface-muted" />
    </div>
  );
}
