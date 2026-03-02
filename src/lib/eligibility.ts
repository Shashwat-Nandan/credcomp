import { CreditCard } from "@/types/card";
import {
  UserProfile,
  EligibilityResult,
  AAFinancialData,
} from "@/types/eligibility";

/**
 * Match a user profile against all cards and return scored results.
 * Uses card eligibility data (minIncome, salariedOnly, minAge) plus
 * tier suitability and category preferences.
 */
export function matchUserToCards(
  profile: UserProfile,
  cards: CreditCard[],
  aaData?: AAFinancialData
): EligibilityResult[] {
  const income = aaData?.verified
    ? aaData.monthlyIncome
    : profile.monthlyIncome;
  const annualIncome = income * 12;

  return cards
    .map((card) => scoreCard(card, profile, annualIncome, aaData))
    .sort((a, b) => b.matchScore - a.matchScore);
}

function scoreCard(
  card: CreditCard,
  profile: UserProfile,
  annualIncome: number,
  aaData?: AAFinancialData
): EligibilityResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  let score = 0;

  // --- Income check (40 points max) ---
  const minIncome = card.eligibility.minIncome ?? 0;
  if (minIncome === 0 || annualIncome >= minIncome) {
    const incomeRatio = minIncome > 0 ? annualIncome / minIncome : 2;
    const incomeScore = Math.min(40, Math.round(incomeRatio * 20));
    score += incomeScore;
    reasons.push(
      minIncome > 0
        ? `Your income meets the minimum requirement`
        : `No minimum income requirement`
    );
  } else {
    const shortfall = ((minIncome - annualIncome) / minIncome) * 100;
    if (shortfall < 20) {
      score += 15;
      reasons.push(`Income is close to the minimum requirement`);
    } else {
      missing.push(
        `Minimum annual income of ${formatIncome(minIncome)} required`
      );
    }
  }

  // --- Age check (15 points max) ---
  const minAge = card.eligibility.minAge ?? 18;
  if (profile.age >= minAge) {
    score += 15;
    reasons.push(`Age requirement met`);
  } else {
    missing.push(`Minimum age of ${minAge} years required`);
  }

  // --- Employment check (15 points max) ---
  if (card.eligibility.salariedOnly && profile.employmentType !== "salaried") {
    missing.push(`This card is for salaried individuals only`);
  } else {
    score += 15;
    if (card.eligibility.salariedOnly) {
      reasons.push(`Available for salaried employees`);
    } else {
      reasons.push(`Available for all employment types`);
    }
  }

  // --- Tier suitability (15 points max) ---
  const tierScore = getTierSuitability(card.tier, annualIncome, profile.hasExistingCard);
  score += tierScore.score;
  if (tierScore.reason) reasons.push(tierScore.reason);

  // --- Category preference match (10 points max) ---
  if (profile.preferredCategories.length > 0) {
    const matchingCategories = card.categories.filter((c) =>
      profile.preferredCategories.includes(c)
    );
    if (matchingCategories.length > 0) {
      const catScore = Math.min(
        10,
        Math.round((matchingCategories.length / profile.preferredCategories.length) * 10)
      );
      score += catScore;
      reasons.push(
        `Matches your interest in ${matchingCategories.join(", ")}`
      );
    }
  } else {
    score += 5; // neutral
  }

  // --- Existing card upgrade path (5 points max) ---
  if (profile.hasExistingCard && profile.existingCardLimit) {
    if (card.tier === "premium" || card.tier === "super-premium") {
      if (profile.existingCardLimit >= 200000) {
        score += 5;
        reasons.push(`Good upgrade based on your existing card limit`);
      }
    } else {
      score += 3;
    }
  }

  // --- AA verified bonus ---
  if (aaData?.verified) {
    score += 5;
    reasons.push(`Income verified via Account Aggregator`);

    if (aaData.averageMonthlyBalance > annualIncome / 12) {
      score += 3;
      reasons.push(`Healthy average monthly balance`);
    }

    if (aaData.activeLoanCount === 0) {
      score += 2;
      reasons.push(`No active loans — clean credit profile`);
    }
  }

  // Cap at 100
  score = Math.min(100, score);

  return {
    card,
    matchScore: score,
    matchLevel: getMatchLevel(score, missing.length),
    matchReasons: reasons,
    missingCriteria: missing,
  };
}

function getTierSuitability(
  tier: string,
  annualIncome: number,
  hasExistingCard: boolean
): { score: number; reason?: string } {
  switch (tier) {
    case "entry":
      if (annualIncome < 500000) return { score: 15, reason: "Entry-level card well suited for your profile" };
      return { score: 8 };
    case "mid":
      if (annualIncome >= 400000 && annualIncome <= 1500000)
        return { score: 15, reason: "Mid-range card is a great fit for your income" };
      return { score: 10 };
    case "premium":
      if (annualIncome >= 1000000)
        return { score: 15, reason: "Premium card suitable for your income level" };
      if (hasExistingCard) return { score: 10 };
      return { score: 5 };
    case "super-premium":
      if (annualIncome >= 2400000)
        return { score: 15, reason: "Super-premium card matches your high income" };
      if (annualIncome >= 1500000 && hasExistingCard)
        return { score: 10, reason: "Possible upgrade to super-premium tier" };
      return { score: 3 };
    default:
      return { score: 8 };
  }
}

function getMatchLevel(
  score: number,
  missingCount: number
): EligibilityResult["matchLevel"] {
  if (missingCount > 0 && score < 40) return "unlikely";
  if (missingCount > 0) return "possible";
  if (score >= 75) return "excellent";
  if (score >= 50) return "good";
  return "possible";
}

function formatIncome(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)} Lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
