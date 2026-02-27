import { CreditCard } from "./card";

export interface ComparisonField {
  label: string;
  key: string;
  getValue: (card: CreditCard) => string | number | boolean | null;
  format?: "currency" | "percentage" | "number" | "text" | "boolean";
  higherIsBetter?: boolean;
}

export interface ComparisonResult {
  cards: CreditCard[];
  winners: Record<string, string>; // field key -> winning card slug
}
