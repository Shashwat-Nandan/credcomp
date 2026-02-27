import { Metadata } from "next";
import { CreditCard } from "@/types";
import { SITE_NAME, SITE_URL } from "./constants";
import { formatCurrency, getIssuerDisplayName } from "./utils";

export function buildMetadata({
  title,
  description,
  path = "",
  ogImage,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function buildProductJsonLd(card: CreditCard) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    description: `${card.name} by ${getIssuerDisplayName(card.issuer)} — ${card.pros[0] || ""}`,
    image: `${SITE_URL}${card.imageUrl}`,
    brand: {
      "@type": "Organization",
      name: getIssuerDisplayName(card.issuer),
    },
    offers: {
      "@type": "Offer",
      price: card.fees.annual,
      priceCurrency: "INR",
      description: `Annual fee: ${formatCurrency(card.fees.annual)}`,
    },
    ...(card.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: card.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1,
      },
    }),
  };
}

export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function buildItemListJsonLd(
  cards: CreditCard[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: cards.length,
    itemListElement: cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/cards/${card.slug}`,
      name: card.name,
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/cards?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
