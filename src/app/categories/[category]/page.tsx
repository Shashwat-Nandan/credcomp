import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCardsByCategory } from "@/lib/cards";
import { CardGrid } from "@/components/cards/CardGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd, buildMetadata } from "@/lib/seo";
import { capitalize } from "@/lib/utils";
import categoriesData from "@/data/categories.json";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categoriesData.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = categoriesData.find((c) => c.slug === category);
  if (!cat) return {};

  return buildMetadata({
    title: `Best ${cat.name} Credit Cards in India`,
    description: `${cat.description}. Compare the best ${cat.name.toLowerCase()} credit cards from all major Indian banks.`,
    path: `/categories/${category}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = categoriesData.find((c) => c.slug === category);
  if (!cat) notFound();

  const cards = getCardsByCategory(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={buildItemListJsonLd(cards, `Best ${cat.name} Credit Cards`)} />
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/cards" },
          { label: cat.name, href: `/categories/${category}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-[var(--color-primary)]">
        Best {cat.name} Credit Cards
      </h1>
      <p className="mt-2 text-gray-500">{cat.description}</p>
      <p className="mt-1 text-sm text-gray-400">{cards.length} cards found</p>

      <div className="mt-8">
        <CardGrid cards={cards} emptyMessage={`No ${cat.name.toLowerCase()} cards found.`} />
      </div>
    </div>
  );
}
