import { Metadata } from "next";
import { getAllCards } from "@/lib/cards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PointCalculator } from "@/components/calculators/PointCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Rewards Calculator",
  description:
    "Calculate how many reward points you can earn with different credit cards based on your monthly spending. Find the best card for your habits.",
  path: "/calculator",
});

export default function CalculatorPage() {
  const allCards = getAllCards();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Rewards Calculator", href: "/calculator" }]} />

      <h1 className="text-3xl font-bold text-[var(--color-primary)]">Rewards Calculator</h1>
      <p className="mt-2 text-gray-500">
        Enter your monthly spending to see estimated reward points and their value across all cards.
      </p>

      <div className="mt-8">
        <PointCalculator cards={allCards} />
      </div>
    </div>
  );
}
