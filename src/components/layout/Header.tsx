"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary)]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="6" fill="var(--color-accent)" />
            <path d="M7 10h14M7 14h10M7 18h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          CredComp
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/cards" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            All Cards
          </Link>
          <Link href="/compare" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            Compare
          </Link>
          <Link href="/calculator" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            Calculator
          </Link>
          <Link href="/eligibility" className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">
            Check Eligibility
          </Link>
          <Link href="/categories/travel" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            Travel
          </Link>
          <Link href="/categories/cashback" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            Cashback
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/cards" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              All Cards
            </Link>
            <Link href="/compare" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Compare
            </Link>
            <Link href="/calculator" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Rewards Calculator
            </Link>
            <Link href="/eligibility" className="text-sm font-medium text-[var(--color-accent)]" onClick={() => setMobileOpen(false)}>
              Check Eligibility
            </Link>
            <Link href="/categories/travel" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Travel Cards
            </Link>
            <Link href="/categories/cashback" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Cashback Cards
            </Link>
            <Link href="/categories/premium" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Premium Cards
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
