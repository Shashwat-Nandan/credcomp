"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { AAFinancialData } from "@/types/eligibility";
import {
  SUPPORTED_BANKS,
  createConsentRequest,
  checkConsentStatus,
  fetchFinancialData,
} from "@/lib/aa-service";

interface AAConsentFlowProps {
  onComplete: (data: AAFinancialData) => void;
  onCancel: () => void;
}

type FlowStep = "intro" | "mobile" | "bank" | "consent" | "fetching" | "done";

export function AAConsentFlow({ onComplete, onCancel }: AAConsentFlowProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>("intro");
  const [mobile, setMobile] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [fetchedData, setFetchedData] = useState<AAFinancialData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleInitiateConsent() {
    if (!mobile || mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError(null);
    setFlowStep("bank");
  }

  async function handleBankSelect(bankId: string) {
    setSelectedBank(bankId);
    setFlowStep("consent");
  }

  async function handleApproveConsent() {
    setFlowStep("fetching");
    setError(null);

    try {
      // Step 1: Create consent request
      const { consentId } = await createConsentRequest(mobile, selectedBank);

      // Step 2: Check consent status (simulated approval)
      await checkConsentStatus(consentId);

      // Step 3: Fetch financial data
      const data = await fetchFinancialData(consentId, selectedBank);

      setFetchedData(data);
      setFlowStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setFlowStep("consent");
    }
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-primary)]">
              Account Aggregator Verification
            </h4>
            <p className="text-sm text-gray-500">
              Powered by RBI-licensed Account Aggregator framework
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step: Intro */}
      {flowStep === "intro" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Verify your financial profile securely using India&apos;s Account
            Aggregator framework. This provides:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Verified income</strong> — More accurate eligibility
                results
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Secure & consent-based</strong> — Your data is encrypted
                and you control access
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>RBI regulated</strong> — Licensed Account Aggregators
                ensure data safety
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>No documents needed</strong> — Instant digital
                verification
              </span>
            </li>
          </ul>
          <button
            onClick={() => setFlowStep("mobile")}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Verify My Income
          </button>
        </div>
      )}

      {/* Step: Mobile number */}
      {flowStep === "mobile" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the mobile number linked to your bank account. An OTP will be
            sent for verification.
          </p>
          <div>
            <label
              htmlFor="aa-mobile"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                +91
              </span>
              <input
                id="aa-mobile"
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Enter 10-digit number"
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-12 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFlowStep("intro")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleInitiateConsent}
              disabled={mobile.length !== 10}
              className={clsx(
                "flex-1 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors",
                mobile.length === 10
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-300"
              )}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step: Bank selection */}
      {flowStep === "bank" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select your primary bank account for income verification.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_BANKS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleBankSelect(bank.id)}
                className="rounded-lg border border-gray-200 px-3 py-3 text-left text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                {bank.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFlowStep("mobile")}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            &larr; Back
          </button>
        </div>
      )}

      {/* Step: Consent confirmation */}
      {flowStep === "consent" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <h5 className="font-medium text-[var(--color-primary)]">
              Consent Request
            </h5>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Purpose:</span> Credit card
                eligibility assessment
              </p>
              <p>
                <span className="font-medium">Data requested:</span> Bank
                account summary (last 6 months)
              </p>
              <p>
                <span className="font-medium">Bank:</span>{" "}
                {SUPPORTED_BANKS.find((b) => b.id === selectedBank)?.name}
              </p>
              <p>
                <span className="font-medium">Access type:</span> One-time view
              </p>
              <p>
                <span className="font-medium">Consent validity:</span> 24 hours
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            By approving, you consent to sharing your financial data for
            eligibility verification. You can revoke this consent anytime through
            your Account Aggregator app.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setFlowStep("bank")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleApproveConsent}
              className="flex-1 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Approve & Fetch Data
            </button>
          </div>
        </div>
      )}

      {/* Step: Fetching */}
      {flowStep === "fetching" && (
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="font-medium text-[var(--color-primary)]">
            Fetching your financial data...
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Securely retrieving data from your bank via Account Aggregator
          </p>
        </div>
      )}

      {/* Step: Done */}
      {flowStep === "done" && fetchedData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Verification Complete</span>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h5 className="mb-3 text-sm font-semibold text-[var(--color-primary)]">
              Verified Financial Profile
            </h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Monthly Income</span>
                <p className="font-semibold">
                  ₹{fetchedData.monthlyIncome.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Avg. Monthly Balance</span>
                <p className="font-semibold">
                  ₹
                  {fetchedData.averageMonthlyBalance.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Account Age</span>
                <p className="font-semibold">
                  {fetchedData.accountAge} months
                </p>
              </div>
              <div>
                <span className="text-gray-500">Active Loans</span>
                <p className="font-semibold">{fetchedData.activeLoanCount}</p>
              </div>
              <div>
                <span className="text-gray-500">Monthly EMI Outflow</span>
                <p className="font-semibold">
                  ₹{fetchedData.totalEmiOutflow.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Bank</span>
                <p className="font-semibold">{fetchedData.bankName}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onComplete(fetchedData)}
            className="w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Update Eligibility Results
          </button>
        </div>
      )}
    </div>
  );
}
