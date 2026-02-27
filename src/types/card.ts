export interface CategoryRate {
  category: string;
  rate: number;
  description?: string;
}

export interface CappedCategory {
  category: string;
  maxPointsPerMonth?: number;
}

export interface Fees {
  joining: number;
  annual: number;
  renewal: number;
  waiverCondition?: string;
  waiverSpendThreshold?: number;
}

export interface Rewards {
  pointName: string;
  baseEarnRate: number;
  pointValue: number;
  maxPointValue?: number;
  categoryRates: CategoryRate[];
  cappedCategories?: CappedCategory[];
  exclusions?: string[];
  redemptionOptions: string[];
}

export interface WelcomeBenefit {
  description: string;
  value?: number;
  condition?: string;
}

export interface MilestoneBenefit {
  spendThreshold: number;
  period: string;
  benefit: string;
  value?: number;
}

export interface LoungeAccess {
  domestic: { complimentaryVisits: number; visitPeriod: string };
  international: { complimentaryVisits: number; visitPeriod: string };
  provider: string;
}

export interface Insurance {
  airAccident?: string;
  travelInsurance?: string;
  purchaseProtection?: string;
}

export interface FuelSurchargeWaiver {
  percentage: number;
  maxPerMonth: number;
}

export interface Eligibility {
  minIncome?: number;
  salariedOnly?: boolean;
  minAge?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export type CardNetwork = "visa" | "mastercard" | "amex" | "rupay" | "dinersclub";
export type CardTier = "entry" | "mid" | "premium" | "super-premium";

export interface CreditCard {
  slug: string;
  name: string;
  issuer: string;
  network: CardNetwork;
  tier: CardTier;
  categories: string[];
  imageUrl: string;
  applyUrl?: string;
  fees: Fees;
  rewards: Rewards;
  welcomeBenefits: WelcomeBenefit[];
  milestoneBenefits: MilestoneBenefit[];
  loungeAccess?: LoungeAccess;
  insurance?: Insurance;
  fuelSurchargeWaiver?: FuelSurchargeWaiver;
  foreignCurrencyMarkup: number;
  additionalBenefits: string[];
  eligibility: Eligibility;
  rating?: number;
  pros: string[];
  cons: string[];
  idealFor: string[];
  lastUpdated: string;
  faqs?: FAQ[];
}
