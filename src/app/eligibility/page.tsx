import { Metadata } from "next";
import { getAllCards } from "@/lib/cards";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EligibilityForm } from "@/components/eligibility/EligibilityForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Check Credit Card Eligibility",
  description:
    "Check your eligibility for 80+ Indian credit cards in under a minute. Get personalized recommendations based on your income, age, and preferences. Verify instantly with Account Aggregator.",
  path: "/eligibility",
});

export default function EligibilityPage() {
  const allCards = getAllCards();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Check Eligibility", href: "/eligibility" }]}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
          Check Your Credit Card Eligibility
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-500">
          Answer a few quick questions to find credit cards you&apos;re eligible for.
          Optionally verify your income with Account Aggregator for more accurate results.
        </p>
      </div>

      <div className="mt-10">
        <EligibilityForm cards={allCards} />
      </div>
    </div>
  );
}
