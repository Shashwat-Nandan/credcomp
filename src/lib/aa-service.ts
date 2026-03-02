/**
 * Account Aggregator Service Module
 *
 * Designed for integration with Setu AA Gateway (https://docs.setu.co/data/account-aggregator).
 * Currently uses simulated responses for the static site.
 * Replace the mock implementations with actual Setu API calls when a backend is available.
 *
 * Integration flow:
 * 1. FIU (CredComp backend) creates a consent request via Setu API
 * 2. User is redirected to AA consent screen (Setu embeddable UI)
 * 3. User approves consent, selects bank accounts
 * 4. Setu fetches financial data from FIP (user's bank)
 * 5. FIU receives financial data for eligibility analysis
 */

import { AAConsentStatus, AAFinancialData } from "@/types/eligibility";

// Setu AA API types (for future backend integration)
export interface SetuConsentRequest {
  consentDuration: { unit: "MONTH"; value: number };
  consentMode: "VIEW";
  fetchType: "ONETIME";
  consentTypes: string[];
  fiTypes: string[];
  dataRange: { from: string; to: string };
  redirectUrl: string;
}

export interface SetuConsentResponse {
  id: string;
  url: string; // Redirect URL for user consent
  status: string;
}

/**
 * Supported banks for Account Aggregator data fetching.
 * These are common FIPs (Financial Information Providers) in the AA ecosystem.
 */
export const SUPPORTED_BANKS = [
  { id: "sbi", name: "State Bank of India" },
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "axis", name: "Axis Bank" },
  { id: "kotak", name: "Kotak Mahindra Bank" },
  { id: "pnb", name: "Punjab National Bank" },
  { id: "bob", name: "Bank of Baroda" },
  { id: "idfc", name: "IDFC FIRST Bank" },
  { id: "indusind", name: "IndusInd Bank" },
  { id: "federal", name: "Federal Bank" },
];

/**
 * Simulate creating a consent request.
 * In production, this would call: POST /consents via Setu AA API
 */
export async function createConsentRequest(
  mobileNumber: string,
  _selectedBank: string
): Promise<{ consentId: string; status: AAConsentStatus }> {
  // Simulate API delay
  await delay(1500);

  return {
    consentId: `consent_${Date.now()}_${mobileNumber.slice(-4)}`,
    status: {
      status: "pending",
      consentId: `consent_${Date.now()}_${mobileNumber.slice(-4)}`,
    },
  };
}

/**
 * Simulate checking consent status.
 * In production, this would call: GET /consents/{id} via Setu AA API
 */
export async function checkConsentStatus(
  consentId: string
): Promise<AAConsentStatus> {
  await delay(1000);

  return {
    status: "approved",
    consentId,
    dataFetched: false,
  };
}

/**
 * Simulate fetching financial data after consent approval.
 * In production, this would call: POST /sessions and GET /sessions/{id} via Setu AA API
 *
 * Returns analyzed financial profile from bank statement data.
 */
export async function fetchFinancialData(
  _consentId: string,
  bankId: string
): Promise<AAFinancialData> {
  await delay(2000);

  // Simulated financial data based on bank selection
  const bank = SUPPORTED_BANKS.find((b) => b.id === bankId);

  return {
    verified: true,
    averageMonthlyBalance: 85000 + Math.round(Math.random() * 50000),
    monthlyIncome: 65000 + Math.round(Math.random() * 35000),
    accountAge: 24 + Math.round(Math.random() * 48),
    activeLoanCount: Math.round(Math.random() * 2),
    totalEmiOutflow: Math.round(Math.random() * 15000),
    bankName: bank?.name ?? "Unknown Bank",
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
