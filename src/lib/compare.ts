import { CreditCard } from "@/types";

export interface ComparisonField {
  label: string;
  key: string;
  getValue: (card: CreditCard) => string | number | null;
  format?: "currency" | "percentage" | "number" | "text";
  higherIsBetter?: boolean;
}

export const comparisonFields: ComparisonField[] = [
  {
    label: "Annual Fee",
    key: "annualFee",
    getValue: (c) => c.fees.annual,
    format: "currency",
    higherIsBetter: false,
  },
  {
    label: "Joining Fee",
    key: "joiningFee",
    getValue: (c) => c.fees.joining,
    format: "currency",
    higherIsBetter: false,
  },
  {
    label: "Base Reward Rate",
    key: "baseRewardRate",
    getValue: (c) => c.rewards.baseEarnRate,
    format: "number",
    higherIsBetter: true,
  },
  {
    label: "Point Value (₹)",
    key: "pointValue",
    getValue: (c) => c.rewards.pointValue,
    format: "number",
    higherIsBetter: true,
  },
  {
    label: "Foreign Currency Markup",
    key: "forexMarkup",
    getValue: (c) => c.foreignCurrencyMarkup,
    format: "percentage",
    higherIsBetter: false,
  },
  {
    label: "Domestic Lounge Visits",
    key: "domesticLounge",
    getValue: (c) => c.loungeAccess?.domestic.complimentaryVisits ?? null,
    format: "number",
    higherIsBetter: true,
  },
  {
    label: "International Lounge Visits",
    key: "intlLounge",
    getValue: (c) => c.loungeAccess?.international.complimentaryVisits ?? null,
    format: "number",
    higherIsBetter: true,
  },
  {
    label: "Rating",
    key: "rating",
    getValue: (c) => c.rating ?? null,
    format: "number",
    higherIsBetter: true,
  },
];

export function detectWinners(
  cards: CreditCard[],
  fields: ComparisonField[] = comparisonFields
): Record<string, string | null> {
  const winners: Record<string, string | null> = {};

  for (const field of fields) {
    const values = cards.map((card) => ({
      slug: card.slug,
      value: field.getValue(card),
    }));

    const numericValues = values.filter((v) => v.value !== null && typeof v.value === "number");
    if (numericValues.length < 2) {
      winners[field.key] = null;
      continue;
    }

    const sorted = [...numericValues].sort((a, b) => {
      const aVal = a.value as number;
      const bVal = b.value as number;
      return field.higherIsBetter ? bVal - aVal : aVal - bVal;
    });

    // Only declare winner if values differ
    if (sorted[0].value !== sorted[1].value) {
      winners[field.key] = sorted[0].slug;
    } else {
      winners[field.key] = null;
    }
  }

  return winners;
}

export function getComparisonUrl(slugs: string[]): string {
  return `/compare?cards=${slugs.join(",")}`;
}

export function parseComparisonSlugs(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}
