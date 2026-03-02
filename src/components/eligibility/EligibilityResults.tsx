"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { EligibilityResult, UserProfile } from "@/types/eligibility";
import { formatCurrency, getIssuerDisplayName } from "@/lib/utils";
import { NETWORK_LABELS, TIER_LABELS } from "@/lib/constants";
import { CreditCardVisual } from "@/components/cards/CreditCardVisual";

interface EligibilityResultsProps {
  results: EligibilityResult[];
  profile: UserProfile;
  aaVerified: boolean;
}

type FilterLevel = "all" | "excellent" | "good" | "possible";

const MATCH_COLORS = {
  excellent: {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
  good: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  possible: {
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
  unlikely: {
    bg: "bg-gray-50",
    border: "border-gray-300",
    text: "text-gray-500",
    badge: "bg-gray-100 text-gray-500",
  },
};

export function EligibilityResults({
  results,
  profile,
  aaVerified,
}: EligibilityResultsProps) {
  const [filter, setFilter] = useState<FilterLevel>("all");

  const counts = {
    excellent: results.filter((r) => r.matchLevel === "excellent").length,
    good: results.filter((r) => r.matchLevel === "good").length,
    possible: results.filter(
      (r) => r.matchLevel === "possible" || r.matchLevel === "unlikely"
    ).length,
  };

  const filtered =
    filter === "all"
      ? results.filter((r) => r.matchLevel !== "unlikely")
      : results.filter((r) => r.matchLevel === filter);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-primary)]">
              Your Eligibility Results
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Based on your {aaVerified ? "verified " : ""}profile:{" "}
              {profile.employmentType === "salaried"
                ? "Salaried"
                : profile.employmentType === "self-employed"
                  ? "Self-employed"
                  : "Business owner"}
              , ₹{profile.monthlyIncome.toLocaleString("en-IN")}/month,{" "}
              {profile.age} years
            </p>
          </div>
          {aaVerified && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              AA Verified
            </span>
          )}
        </div>

        {/* Filter pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterPill
            label={`All (${results.filter((r) => r.matchLevel !== "unlikely").length})`}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterPill
            label={`Excellent (${counts.excellent})`}
            active={filter === "excellent"}
            onClick={() => setFilter("excellent")}
            color="emerald"
          />
          <FilterPill
            label={`Good (${counts.good})`}
            active={filter === "good"}
            onClick={() => setFilter("good")}
            color="blue"
          />
          <FilterPill
            label={`Possible (${counts.possible})`}
            active={filter === "possible"}
            onClick={() => setFilter("possible")}
            color="amber"
          />
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {filtered.map((result) => (
          <ResultCard key={result.card.slug} result={result} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
          <p className="text-gray-500">
            No cards match this filter. Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        active
          ? color === "emerald"
            ? "border-emerald-400 bg-emerald-100 text-emerald-700"
            : color === "blue"
              ? "border-blue-400 bg-blue-100 text-blue-700"
              : color === "amber"
                ? "border-amber-400 bg-amber-100 text-amber-700"
                : "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
          : "border-gray-200 text-gray-600 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  );
}

function ResultCard({ result }: { result: EligibilityResult }) {
  const [expanded, setExpanded] = useState(false);
  const { card, matchScore, matchLevel, matchReasons, missingCriteria } =
    result;
  const colors = MATCH_COLORS[matchLevel];

  return (
    <div
      className={clsx(
        "rounded-xl border bg-white transition-all",
        expanded ? colors.border : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Card visual */}
          <div className="hidden shrink-0 sm:block">
            <CreditCardVisual
              name={card.name}
              issuer={card.issuer}
              network={card.network}
              imageUrl={card.imageUrl}
              size="sm"
            />
          </div>

          {/* Card info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-[var(--color-primary)]">
                  {card.name}
                </h4>
                <p className="mt-0.5 text-sm text-gray-500">
                  {getIssuerDisplayName(card.issuer)} &middot;{" "}
                  {NETWORK_LABELS[card.network]} &middot;{" "}
                  {TIER_LABELS[card.tier]}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold",
                    colors.badge
                  )}
                >
                  {matchScore}%
                </div>
                <p
                  className={clsx(
                    "mt-0.5 text-xs font-medium capitalize",
                    colors.text
                  )}
                >
                  {matchLevel}
                </p>
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>
                Annual Fee:{" "}
                <span className="font-medium">
                  {card.fees.annual === 0
                    ? "FREE"
                    : formatCurrency(card.fees.annual)}
                </span>
              </span>
              <span>
                Reward Rate:{" "}
                <span className="font-medium">
                  {card.rewards.baseEarnRate}x
                </span>
              </span>
              {card.eligibility.minIncome && (
                <span>
                  Min Income:{" "}
                  <span className="font-medium">
                    ₹
                    {(card.eligibility.minIncome / 100000).toFixed(
                      card.eligibility.minIncome % 100000 === 0 ? 0 : 1
                    )}
                    L
                  </span>
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {card.applyUrl && matchLevel !== "unlikely" && (
                <a
                  href={card.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors"
                >
                  Apply Now
                </a>
              )}
              <a
                href={`/cards/${card.slug}`}
                className="inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                View Details
              </a>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                {expanded ? "Hide Details" : "Why this match?"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {matchReasons.length > 0 && (
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Why You Qualify
                </h5>
                <ul className="space-y-1">
                  {matchReasons.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {missingCriteria.length > 0 && (
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                  Potential Gaps
                </h5>
                <ul className="space-y-1">
                  {missingCriteria.map((gap, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
