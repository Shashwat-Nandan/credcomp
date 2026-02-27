import { MetadataRoute } from "next";
import { getCardSlugs } from "@/lib/cards";
import { SITE_URL } from "@/lib/constants";
import categoriesData from "@/data/categories.json";
import issuersData from "@/data/issuers.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const cardSlugs = getCardSlugs();

  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/cards`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/calculator`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const cardPages = cardSlugs.map((slug) => ({
    url: `${SITE_URL}/cards/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryPages = categoriesData.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const issuerPages = issuersData.map((issuer) => ({
    url: `${SITE_URL}/issuers/${issuer.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cardPages, ...categoryPages, ...issuerPages];
}
