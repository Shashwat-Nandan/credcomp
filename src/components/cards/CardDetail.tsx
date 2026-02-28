import { CreditCard } from "@/types";
import { formatCurrency, getIssuerDisplayName, getIssuerGradient } from "@/lib/utils";
import { NETWORK_LABELS, TIER_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import Link from "next/link";
import { getComparisonUrl } from "@/lib/compare";

export function CardDetail({ card, relatedSlugs }: { card: CreditCard; relatedSlugs: string[] }) {
  const [from, to] = getIssuerGradient(card.issuer);

  return (
    <article className="space-y-8">
      {/* Hero section */}
      <section className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Card image placeholder */}
        <div
          className="flex h-56 w-full shrink-0 items-center justify-center rounded-xl md:w-72"
          style={{ background: `linear-gradient(to bottom right, ${from}, ${to})` }}
        >
          <div className="text-center text-white">
            <div className="text-3xl font-bold drop-shadow-sm">{card.name.split(" ").slice(-1)[0]}</div>
            <div className="mt-2 text-sm opacity-75">{getIssuerDisplayName(card.issuer)}</div>
            <div className="mt-1 text-xs opacity-50">{NETWORK_LABELS[card.network]}</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{TIER_LABELS[card.tier]}</Badge>
            {card.categories.map((cat) => (
              <Link key={cat} href={`/categories/${cat}`}>
                <Badge variant="outline" className="capitalize hover:bg-gray-50">{cat}</Badge>
              </Link>
            ))}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
            {card.name}
          </h1>
          <p className="mt-1 text-gray-500">
            by{" "}
            <Link href={`/issuers/${card.issuer}`} className="font-medium text-[var(--color-accent)] hover:underline">
              {getIssuerDisplayName(card.issuer)}
            </Link>
          </p>
          {card.rating && (
            <div className="mt-3">
              <StarRating rating={card.rating} showValue size="md" />
            </div>
          )}

          {/* Quick compare */}
          {relatedSlugs.length > 0 && (
            <div className="mt-4">
              <Link
                href={getComparisonUrl([card.slug, ...relatedSlugs.slice(0, 2)])}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors"
              >
                Compare with similar cards
              </Link>
            </div>
          )}

          {card.applyUrl && (
            <a
              href={card.applyUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-red-50 transition-colors"
            >
              Apply Now &rarr;
            </a>
          )}
        </div>
      </section>

      {/* Fees */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Fees</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FeeCard label="Joining Fee" value={card.fees.joining} />
          <FeeCard label="Annual Fee" value={card.fees.annual} />
          <FeeCard label="Renewal Fee" value={card.fees.renewal} />
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-500">Forex Markup</div>
            <div className="mt-1 text-lg font-semibold">{card.foreignCurrencyMarkup}%</div>
          </div>
        </div>
        {card.fees.waiverCondition && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Fee Waiver:</span> {card.fees.waiverCondition}
            {card.fees.waiverSpendThreshold && (
              <> (spend {formatCurrency(card.fees.waiverSpendThreshold)})</>
            )}
          </p>
        )}
      </section>

      {/* Rewards */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Rewards</h2>
        <div className="mt-3 rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs text-gray-500">Reward Currency</div>
              <div className="mt-1 font-semibold">{card.rewards.pointName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Base Earn Rate</div>
              <div className="mt-1 font-semibold">{card.rewards.baseEarnRate}x</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Point Value</div>
              <div className="mt-1 font-semibold">
                {card.rewards.pointValue < 1
                  ? `₹${card.rewards.pointValue}`
                  : formatCurrency(card.rewards.pointValue)}
                {card.rewards.maxPointValue && (
                  <span className="text-gray-400"> — {formatCurrency(card.rewards.maxPointValue)}</span>
                )}
              </div>
            </div>
          </div>

          {card.rewards.categoryRates.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700">Bonus Categories</h3>
              <div className="mt-2 space-y-2">
                {card.rewards.categoryRates.map((cr) => (
                  <div key={cr.category} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
                    <span className="capitalize">{cr.category}</span>
                    <span className="font-semibold">{cr.rate}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {card.rewards.redemptionOptions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700">Redemption Options</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {card.rewards.redemptionOptions.map((opt) => (
                  <Badge key={opt} variant="outline">{opt}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Welcome & Milestone Benefits */}
      {(card.welcomeBenefits.length > 0 || card.milestoneBenefits.length > 0) && (
        <section>
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Benefits</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {card.welcomeBenefits.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800">Welcome Benefits</h3>
                <ul className="mt-2 space-y-2">
                  {card.welcomeBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-[var(--color-accent)]">&#10003;</span>
                      <div>
                        {b.description}
                        {b.value && <span className="text-gray-400"> (worth {formatCurrency(b.value)})</span>}
                        {b.condition && <span className="text-gray-400"> — {b.condition}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {card.milestoneBenefits.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800">Milestone Benefits</h3>
                <ul className="mt-2 space-y-2">
                  {card.milestoneBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-[var(--color-accent)]">&#9733;</span>
                      <div>
                        Spend {formatCurrency(b.spendThreshold)} in {b.period}: {b.benefit}
                        {b.value && <span className="text-gray-400"> (worth {formatCurrency(b.value)})</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lounge Access */}
      {card.loungeAccess && (
        <section>
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Lounge Access</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Domestic</div>
              <div className="mt-1 text-lg font-semibold">
                {card.loungeAccess.domestic.complimentaryVisits === -1 ? "Unlimited" : card.loungeAccess.domestic.complimentaryVisits}
              </div>
              {card.loungeAccess.domestic.complimentaryVisits !== -1 && (
                <div className="text-xs text-gray-400">per {card.loungeAccess.domestic.visitPeriod}</div>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">International</div>
              <div className="mt-1 text-lg font-semibold">
                {card.loungeAccess.international.complimentaryVisits === -1 ? "Unlimited" : card.loungeAccess.international.complimentaryVisits}
              </div>
              {card.loungeAccess.international.complimentaryVisits !== -1 && (
                <div className="text-xs text-gray-400">per {card.loungeAccess.international.visitPeriod}</div>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Provider</div>
              <div className="mt-1 font-semibold">{card.loungeAccess.provider}</div>
            </div>
          </div>
        </section>
      )}

      {/* Insurance */}
      {card.insurance && (
        <section>
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Insurance</h2>
          <div className="mt-3 space-y-2">
            {card.insurance.airAccident && (
              <div className="flex justify-between rounded-md bg-gray-50 px-4 py-2 text-sm">
                <span>Air Accident Cover</span>
                <span className="font-medium">{card.insurance.airAccident}</span>
              </div>
            )}
            {card.insurance.travelInsurance && (
              <div className="flex justify-between rounded-md bg-gray-50 px-4 py-2 text-sm">
                <span>Travel Insurance</span>
                <span className="font-medium">{card.insurance.travelInsurance}</span>
              </div>
            )}
            {card.insurance.purchaseProtection && (
              <div className="flex justify-between rounded-md bg-gray-50 px-4 py-2 text-sm">
                <span>Purchase Protection</span>
                <span className="font-medium">{card.insurance.purchaseProtection}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Eligibility */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Eligibility</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {card.eligibility.minIncome && (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Minimum Income</div>
              <div className="mt-1 font-semibold">{formatCurrency(card.eligibility.minIncome)}/yr</div>
            </div>
          )}
          {card.eligibility.minAge && (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Minimum Age</div>
              <div className="mt-1 font-semibold">{card.eligibility.minAge} years</div>
            </div>
          )}
          {card.eligibility.salariedOnly !== undefined && (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Employment</div>
              <div className="mt-1 font-semibold">{card.eligibility.salariedOnly ? "Salaried Only" : "Salaried & Self-Employed"}</div>
            </div>
          )}
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
          <h2 className="font-bold text-emerald-800">Pros</h2>
          <ul className="mt-2 space-y-1.5">
            {card.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                <span className="mt-0.5">&#10003;</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
          <h2 className="font-bold text-red-800">Cons</h2>
          <ul className="mt-2 space-y-1.5">
            {card.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                <span className="mt-0.5">&#10007;</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ideal For */}
      {card.idealFor.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Ideal For</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.idealFor.map((item) => (
              <Badge key={item} variant="success">{item}</Badge>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {card.faqs && card.faqs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-3">
            {card.faqs.map((faq, i) => (
              <details key={i} className="group rounded-lg border border-gray-200">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 hover:bg-gray-50">
                  {faq.question}
                </summary>
                <p className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Last updated */}
      <footer className="text-xs text-gray-400">
        <time dateTime={card.lastUpdated}>Last updated: {card.lastUpdated}</time>
      </footer>
    </article>
  );
}

function FeeCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">
        {value === 0 ? "FREE" : formatCurrency(value)}
      </div>
    </div>
  );
}
