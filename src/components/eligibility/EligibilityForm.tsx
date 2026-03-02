"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CreditCard } from "@/types/card";
import {
  UserProfile,
  EmploymentType,
  EligibilityResult,
  AAFinancialData,
} from "@/types/eligibility";
import { matchUserToCards } from "@/lib/eligibility";
import { EligibilityResults } from "./EligibilityResults";
import { AAConsentFlow } from "./AAConsentFlow";

interface EligibilityFormProps {
  cards: CreditCard[];
}

const STEPS = [
  "Employment",
  "Income",
  "Age",
  "Credit History",
  "Preferences",
] as const;

const CATEGORY_OPTIONS = [
  { value: "travel", label: "Travel" },
  { value: "cashback", label: "Cashback" },
  { value: "rewards", label: "Rewards" },
  { value: "dining", label: "Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "fuel", label: "Fuel" },
  { value: "premium", label: "Premium" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "entertainment", label: "Entertainment" },
];

const INCOME_PRESETS = [
  { label: "Under 3L", value: 25000 },
  { label: "3-5 Lakh", value: 35000 },
  { label: "5-8 Lakh", value: 55000 },
  { label: "8-12 Lakh", value: 85000 },
  { label: "12-20 Lakh", value: 130000 },
  { label: "20-50 Lakh", value: 290000 },
  { label: "50 Lakh+", value: 500000 },
];

export function EligibilityForm({ cards }: EligibilityFormProps) {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [aaData, setAAData] = useState<AAFinancialData | undefined>();
  const [showAA, setShowAA] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    employmentType: "salaried",
    monthlyIncome: 0,
    age: 25,
    hasExistingCard: false,
    existingCardLimit: undefined,
    preferredCategories: [],
  });

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Submit
      const matched = matchUserToCards(profile, cards, aaData);
      setResults(matched);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleReset() {
    setStep(0);
    setResults(null);
    setAAData(undefined);
    setShowAA(false);
    setProfile({
      employmentType: "salaried",
      monthlyIncome: 0,
      age: 25,
      hasExistingCard: false,
      existingCardLimit: undefined,
      preferredCategories: [],
    });
  }

  function handleAAComplete(data: AAFinancialData) {
    setAAData(data);
    setShowAA(false);
    // Re-run matching with AA data
    const matched = matchUserToCards(profile, cards, data);
    setResults(matched);
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return true; // employment always has a default
      case 1:
        return profile.monthlyIncome > 0;
      case 2:
        return profile.age >= 18;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  }

  if (results) {
    return (
      <div className="space-y-6">
        <EligibilityResults
          results={results}
          profile={profile}
          aaVerified={!!aaData?.verified}
        />
        <div className="flex flex-wrap gap-3">
          {!aaData && (
            <button
              onClick={() => setShowAA(true)}
              className="rounded-lg border border-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors"
            >
              Verify with Account Aggregator
            </button>
          )}
          <button
            onClick={handleReset}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
        </div>
        {showAA && (
          <AAConsentFlow
            onComplete={handleAAComplete}
            onCancel={() => setShowAA(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={clsx(
                "transition-colors",
                i === step && "text-[var(--color-accent)] font-semibold",
                i < step && "text-[var(--color-success)]"
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <StepEmployment
            value={profile.employmentType}
            onChange={(v) => setProfile({ ...profile, employmentType: v })}
          />
        )}
        {step === 1 && (
          <StepIncome
            value={profile.monthlyIncome}
            onChange={(v) => setProfile({ ...profile, monthlyIncome: v })}
          />
        )}
        {step === 2 && (
          <StepAge
            value={profile.age}
            onChange={(v) => setProfile({ ...profile, age: v })}
          />
        )}
        {step === 3 && (
          <StepCreditHistory
            hasCard={profile.hasExistingCard}
            cardLimit={profile.existingCardLimit}
            onHasCardChange={(v) =>
              setProfile({
                ...profile,
                hasExistingCard: v,
                existingCardLimit: v ? profile.existingCardLimit : undefined,
              })
            }
            onLimitChange={(v) =>
              setProfile({ ...profile, existingCardLimit: v })
            }
          />
        )}
        {step === 4 && (
          <StepPreferences
            selected={profile.preferredCategories}
            onChange={(v) =>
              setProfile({ ...profile, preferredCategories: v })
            }
          />
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={clsx(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
              step === 0
                ? "invisible"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={clsx(
              "rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors",
              canProceed()
                ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"
                : "cursor-not-allowed bg-gray-300"
            )}
          >
            {step === STEPS.length - 1 ? "Check Eligibility" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Step Components ---

function StepEmployment({
  value,
  onChange,
}: {
  value: EmploymentType;
  onChange: (v: EmploymentType) => void;
}) {
  const options: { value: EmploymentType; label: string; desc: string }[] = [
    {
      value: "salaried",
      label: "Salaried",
      desc: "Working for a company with a fixed monthly salary",
    },
    {
      value: "self-employed",
      label: "Self-Employed",
      desc: "Freelancer, consultant, or independent professional",
    },
    {
      value: "business",
      label: "Business Owner",
      desc: "Running your own business or partnership",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">
        What is your employment type?
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        This helps us find cards that match your profile.
      </p>
      <div className="mt-5 space-y-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              "w-full rounded-lg border p-4 text-left transition-all",
              value === opt.value
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <div className="font-medium text-[var(--color-primary)]">
              {opt.label}
            </div>
            <div className="mt-0.5 text-sm text-gray-500">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepIncome({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">
        What is your monthly income?
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Select a range or enter your exact monthly income.
      </p>

      {/* Quick presets */}
      <div className="mt-5 flex flex-wrap gap-2">
        {INCOME_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              value === preset.value
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="mt-5">
        <label
          htmlFor="monthly-income"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Or enter exact amount
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ₹
          </span>
          <input
            id="monthly-income"
            type="number"
            min={0}
            step={5000}
            value={value || ""}
            onChange={(e) =>
              onChange(
                e.target.value === ""
                  ? 0
                  : Math.max(0, parseInt(e.target.value, 10) || 0)
              )
            }
            placeholder="e.g. 50000"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-7 pr-3 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        {value > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Annual income: ₹{(value * 12).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

function StepAge({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">
        How old are you?
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Most credit cards require applicants to be at least 18-21 years old.
      </p>

      <div className="mt-5">
        <input
          type="range"
          min={18}
          max={70}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full accent-[var(--color-accent)]"
        />
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>18</span>
          <span className="text-xl font-bold text-[var(--color-primary)]">
            {value} years
          </span>
          <span>70</span>
        </div>
      </div>
    </div>
  );
}

function StepCreditHistory({
  hasCard,
  cardLimit,
  onHasCardChange,
  onLimitChange,
}: {
  hasCard: boolean;
  cardLimit?: number;
  onHasCardChange: (v: boolean) => void;
  onLimitChange: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">
        Do you have an existing credit card?
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Having an existing card can help you qualify for premium upgrades.
      </p>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onHasCardChange(true)}
          className={clsx(
            "flex-1 rounded-lg border p-4 text-center font-medium transition-all",
            hasCard
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          Yes
        </button>
        <button
          onClick={() => onHasCardChange(false)}
          className={clsx(
            "flex-1 rounded-lg border p-4 text-center font-medium transition-all",
            !hasCard
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          No
        </button>
      </div>

      {hasCard && (
        <div className="mt-5">
          <label
            htmlFor="card-limit"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            What is your current card limit? (optional)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              ₹
            </span>
            <input
              id="card-limit"
              type="number"
              min={0}
              step={10000}
              value={cardLimit || ""}
              onChange={(e) =>
                onLimitChange(
                  e.target.value === ""
                    ? 0
                    : Math.max(0, parseInt(e.target.value, 10) || 0)
                )
              }
              placeholder="e.g. 200000"
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-7 pr-3 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StepPreferences({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(category: string) {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--color-primary)]">
        What benefits interest you most?
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Select one or more categories to find cards that match your lifestyle.
        This is optional.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            onClick={() => toggle(cat.value)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              selected.includes(cat.value)
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
