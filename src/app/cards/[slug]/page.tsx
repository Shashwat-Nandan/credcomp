import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardBySlug, getCardSlugs, getRelatedCards } from "@/lib/cards";
import { CardDetail } from "@/components/cards/CardDetail";
import { CardGrid } from "@/components/cards/CardGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProductJsonLd, buildFAQJsonLd, buildMetadata } from "@/lib/seo";
import { getIssuerDisplayName, formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCardSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return {};

  return buildMetadata({
    title: `${card.name} Review — Fees, Rewards & Benefits`,
    description: `${card.name} by ${getIssuerDisplayName(card.issuer)}: ${formatCurrency(card.fees.annual)} annual fee, ${card.rewards.baseEarnRate}x base rewards. ${card.pros[0] || ""}`,
    path: `/cards/${slug}`,
  });
}

export default async function CardPage({ params }: PageProps) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  const relatedCards = getRelatedCards(card, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildProductJsonLd(card)} />
      {card.faqs && card.faqs.length > 0 && <JsonLd data={buildFAQJsonLd(card.faqs)} />}

      <Breadcrumbs
        items={[
          { label: "All Cards", href: "/cards" },
          { label: card.name, href: `/cards/${slug}` },
        ]}
      />

      <CardDetail card={card} relatedSlugs={relatedCards.map((c) => c.slug)} />

      {/* Related cards */}
      {relatedCards.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Similar Cards</h2>
          <div className="mt-4">
            <CardGrid cards={relatedCards} />
          </div>
        </section>
      )}
    </div>
  );
}
