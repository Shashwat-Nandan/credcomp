import { CreditCard } from "./card";

export type EmploymentType = "salaried" | "self-employed" | "business";

export interface UserProfile {
  employmentType: EmploymentType;
  monthlyIncome: number;
  age: number;
  hasExistingCard: boolean;
  existingCardLimit?: number;
  preferredCategories: string[];
}

export interface EligibilityResult {
  card: CreditCard;
  matchScore: number; // 0-100
  matchLevel: "excellent" | "good" | "possible" | "unlikely";
  matchReasons: string[];
  missingCriteria: string[];
}

export interface AAConsentStatus {
  status: "idle" | "pending" | "approved" | "rejected" | "expired";
  consentId?: string;
  dataFetched?: boolean;
}

export interface AAFinancialData {
  verified: boolean;
  averageMonthlyBalance: number;
  monthlyIncome: number;
  accountAge: number; // in months
  activeLoanCount: number;
  totalEmiOutflow: number;
  bankName: string;
}
