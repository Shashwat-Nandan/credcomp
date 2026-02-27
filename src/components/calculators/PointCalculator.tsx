"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { clsx } from "clsx";

interface PointCalculatorProps {
  cards: CreditCard[];
}

interface SpendingInput {
  groceries: number;
  dining: number;
  travel: number;
  shopping: number;
  fuel: number;
  other: number;
}

const SPENDING_CATEGORIES: { key: keyof SpendingInput; label: string }[] = [
  { key: "groceries", label: "Groceries" },
  { key: "dining", label: "Dining" },
  { key: "travel", label: "Travel" },
  { key: "shopping", label: "Shopping" },
  { key: "fuel", label: "Fuel" },
  { key: "other", label: "Other" },
];

const DEFAULT_SPENDING: SpendingInput = {
  groceries: 0,
  dining: 0,
  travel: 0,
  shopping: 0,
  fuel: 0,
  other: 0,
};

function getCategoryRate(card: CreditCard, category: string): number {
  const match = card.rewards.categoryRates.find(
    (r) => r.category.toLowerCase() === category.toLowerCase()
  );
  return match ? match.rate : card.rewards.baseEarnRate;
}

function calculateAnnualRewards(
  card: CreditCard,
  monthlySpending: SpendingInput
): { points: number; value: number } {
  let monthlyPoints = 0;

  for (const { key } of SPENDING_CATEGORIES) {
    const spend = monthlySpending[key];
    if (spend <= 0) continue;

    const rate =
      key === "other"
        ? card.rewards.baseEarnRate
        : getCategoryRate(card, key);

    // Rate represents points earned per 100/150 rupees spent (depending on card).
    // We treat it as a multiplier: spend * rate gives raw points.
    // Most Indian cards earn `rate` points per 100 rupees.
    monthlyPoints += (spend / 100) * rate;
  }

  const annualPoints = Math.round(monthlyPoints * 12);
  const annualValue = annualPoints * card.rewards.pointValue;

  return { points: annualPoints, value: annualValue };
}

export function PointCalculator({ cards }: PointCalculatorProps) {
  const [spending, setSpending] = useState<SpendingInput>(DEFAULT_SPENDING);

  function handleSpendingChange(key: keyof SpendingInput, rawValue: string) {
    const value = rawValue === "" ? 0 : Math.max(0, parseInt(rawValue, 10) || 0);
    setSpending((prev) => ({ ...prev, [key]: value }));
  }

  const results = useMemo(
    () =>
      cards.map((card) => ({
        card,
        ...calculateAnnualRewards(card, spending),
      })),
    [cards, spending]
  );

  const totalMonthlySpend = Object.values(spending).reduce(
    (sum, v) => sum + v,
    0
  );
  const hasSpending = totalMonthlySpend > 0;

  // Sort by value descending to highlight the best card
  const sortedResults = [...results].sort((a, b) => b.value - a.value);
  const bestSlug = hasSpending ? sortedResults[0]?.card.slug : null;

  return (
    <div className="space-y-6">
      {/* Spending Inputs */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Monthly Spending
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SPENDING_CATEGORIES.map(({ key, label }) => (
            <div key={key}>
              <label
                htmlFor={`spend-${key}`}
                className="mb-1 block text-sm font-medium text-text"
              >
                {label}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                  ₹
                </span>
                <input
                  id={`spend-${key}`}
                  type="number"
                  min={0}
                  step={500}
                  value={spending[key] || ""}
                  onChange={(e) => handleSpendingChange(key, e.target.value)}
                  placeholder="0"
                  className={clsx(
                    "w-full rounded-lg border border-surface-border bg-surface py-2 pl-7 pr-3",
                    "text-sm text-text placeholder:text-text-muted",
                    "transition-colors duration-150",
                    "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
                    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        {hasSpending && (
          <p className="mt-2 text-sm text-text-muted">
            Total monthly spend: {formatCurrency(totalMonthlySpend)} | Annual:{" "}
            {formatCurrency(totalMonthlySpend * 12)}
          </p>
        )}
      </div>

      {/* Results */}
      {hasSpending && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            Estimated Annual Rewards
          </h3>
          <div className="space-y-3">
            {sortedResults.map(({ card, points, value }) => {
              const isBest = card.slug === bestSlug;
              return (
                <div
                  key={card.slug}
                  className={clsx(
                    "rounded-lg border p-4 transition-colors",
                    isBest
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-surface-border bg-surface"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-text">
                          {card.name}
                        </h4>
                        {isBest && cards.length > 1 && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Best Value
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-text-muted">
                        {points.toLocaleString("en-IN")} {card.rewards.pointName} earned
                        <span className="mx-1.5">&middot;</span>
                        Point value: ₹{card.rewards.pointValue} each
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={clsx(
                          "text-lg font-bold",
                          isBest ? "text-emerald-700" : "text-text"
                        )}
                      >
                        {formatCurrency(Math.round(value))}
                      </div>
                      <p className="text-xs text-text-muted">reward value/year</p>
                    </div>
                  </div>

                  {/* Per-category breakdown */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-surface-border pt-3">
                    {SPENDING_CATEGORIES.filter(({ key }) => spending[key] > 0).map(
                      ({ key, label }) => {
                        const rate =
                          key === "other"
                            ? card.rewards.baseEarnRate
                            : getCategoryRate(card, key);
                        return (
                          <span
                            key={key}
                            className="text-xs text-text-muted"
                          >
                            {label}:{" "}
                            <span className="font-medium text-text">
                              {rate}x
                            </span>
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasSpending && (
        <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted/50 px-6 py-8 text-center">
          <p className="text-sm text-text-muted">
            Enter your monthly spending above to see estimated reward points and
            their value for each card.
          </p>
        </div>
      )}
    </div>
  );
}
