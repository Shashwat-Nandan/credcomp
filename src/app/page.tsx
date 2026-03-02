import Link from "next/link";
import { getAllCards } from "@/lib/cards";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardSearch } from "@/components/cards/CardSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebsiteJsonLd, buildItemListJsonLd } from "@/lib/seo";

const CATEGORY_LINKS = [
  { slug: "travel", label: "Travel", emoji: "✈️" },
  { slug: "cashback", label: "Cashback", emoji: "💰" },
  { slug: "rewards", label: "Rewards", emoji: "🎁" },
  { slug: "premium", label: "Premium", emoji: "💎" },
  { slug: "lifestyle", label: "Lifestyle", emoji: "🛍️" },
  { slug: "fuel", label: "Fuel", emoji: "⛽" },
];

export default function HomePage() {
  const allCards = getAllCards();
  const topCards = allCards.slice(0, 6);
  const searchCards = allCards.map((c) => ({
    slug: c.slug,
    name: c.name,
    issuer: c.issuer,
    categories: c.categories,
    tier: c.tier,
    network: c.network,
  }));

  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />
      <JsonLd data={buildItemListJsonLd(topCards, "Top Credit Cards in India")} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] px-4 py-16 text-center text-white sm:py-24">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          Find the Best Credit Card for{" "}
          <span className="text-[var(--color-accent-light)]">Your Spending</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Compare rewards, fees, and benefits across India&apos;s top credit cards.
          Make an informed choice — no hidden agendas.
        </p>
        <div className="mx-auto mt-8 flex justify-center">
          <CardSearch cards={allCards} />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/eligibility"
            className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Check Eligibility
          </Link>
          <Link
            href="/cards"
            className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Browse All Cards
          </Link>
          <Link
            href="/compare"
            className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Compare Cards
          </Link>
        </div>
      </section>

      {/* Category quick links */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-[var(--color-primary)]">
          Browse by Category
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-[var(--color-accent)]/30 hover:shadow-md"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="mt-2 text-sm font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top picks */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Top Picks</h2>
          <Link href="/cards" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-6">
          <CardGrid cards={topCards} />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-[var(--color-surface-muted)] px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Not sure which card is right for you?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-gray-500">
          Check your eligibility in under a minute, compare cards side-by-side, or calculate your potential rewards.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/eligibility"
            className="inline-flex rounded-lg bg-[var(--color-accent)] px-6 py-3 font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Check Eligibility
          </Link>
          <Link
            href="/compare"
            className="inline-flex rounded-lg border border-[var(--color-accent)] px-6 py-3 font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors"
          >
            Compare Cards
          </Link>
          <Link
            href="/calculator"
            className="inline-flex rounded-lg border border-[var(--color-accent)] px-6 py-3 font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors"
          >
            Rewards Calculator
          </Link>
        </div>
      </section>
    </>
  );
}
