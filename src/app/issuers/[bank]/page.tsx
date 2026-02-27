import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardsByIssuer } from "@/lib/cards";
import { CardGrid } from "@/components/cards/CardGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd, buildMetadata } from "@/lib/seo";
import issuersData from "@/data/issuers.json";

interface PageProps {
  params: Promise<{ bank: string }>;
}

export async function generateStaticParams() {
  return issuersData.map((i) => ({ bank: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bank } = await params;
  const issuer = issuersData.find((i) => i.slug === bank);
  if (!issuer) return {};

  return buildMetadata({
    title: `${issuer.name} Credit Cards — Compare All Cards`,
    description: `Compare all ${issuer.name} credit cards. View fees, rewards, benefits, and lounge access for every ${issuer.shortName} card.`,
    path: `/issuers/${bank}`,
  });
}

export default async function IssuerPage({ params }: PageProps) {
  const { bank } = await params;
  const issuer = issuersData.find((i) => i.slug === bank);
  if (!issuer) notFound();

  const cards = getCardsByIssuer(bank);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildItemListJsonLd(cards, `${issuer.name} Credit Cards`)} />
      <Breadcrumbs
        items={[
          { label: "Issuers", href: "/cards" },
          { label: issuer.name, href: `/issuers/${bank}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-[var(--color-primary)]">
        {issuer.name} Credit Cards
      </h1>
      <p className="mt-2 text-gray-500">
        Compare all credit cards from {issuer.name}.
      </p>
      <p className="mt-1 text-sm text-gray-400">{cards.length} cards available</p>

      <div className="mt-8">
        <CardGrid cards={cards} emptyMessage={`No ${issuer.shortName} cards found.`} />
      </div>
    </div>
  );
}
