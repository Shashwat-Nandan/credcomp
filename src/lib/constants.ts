export const SITE_NAME = "CredComp";
export const SITE_DESCRIPTION =
  "Compare Indian credit cards side-by-side. Find the best rewards, cashback, and travel cards from HDFC, SBI, ICICI, Axis, Amex & more.";
export const SITE_URL = "https://credcomp.in";

export const CATEGORIES = [
  "travel",
  "cashback",
  "rewards",
  "premium",
  "lifestyle",
  "fuel",
  "lounge",
  "no-annual-fee",
  "dining",
  "shopping",
  "entertainment",
] as const;

export const ISSUERS = [
  "hdfc",
  "sbi",
  "icici",
  "axis",
  "amex",
  "idfc",
  "au",
  "kotak",
  "indusind",
  "rbl",
  "hsbc",
  "yes",
  "federal",
  "sc",
] as const;

export const NETWORKS = [
  "visa",
  "mastercard",
  "amex",
  "rupay",
  "dinersclub",
] as const;

export const TIER_LABELS: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Range",
  premium: "Premium",
  "super-premium": "Super Premium",
};

export const NETWORK_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  rupay: "RuPay",
  dinersclub: "Diners Club",
};
