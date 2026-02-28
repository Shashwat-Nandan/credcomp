import { CreditCard } from "@/types";
import { comparisonFields, detectWinners } from "@/lib/compare";
import { formatCurrency, formatPercentage, getIssuerDisplayName } from "@/lib/utils";
import { NETWORK_LABELS, TIER_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { clsx } from "clsx";

interface ComparisonTableProps {
  cards: CreditCard[];
}

function formatFieldValue(
  value: string | number | null,
  format?: "currency" | "percentage" | "number" | "text"
): string {
  if (value === null || value === undefined) return "N/A";
  switch (format) {
    case "currency":
      return typeof value === "number" ? formatCurrency(value) : String(value);
    case "percentage":
      return typeof value === "number" ? formatPercentage(value) : String(value);
    case "number":
      return value === Infinity ? "Unlimited" : String(value);
    case "text":
    default:
      return String(value);
  }
}

export function ComparisonTable({ cards }: ComparisonTableProps) {
  const winners = detectWinners(cards);

  return (
    <div className="space-y-8">
      {/* Main comparison table */}
      <div className="w-full overflow-x-auto rounded-lg border border-surface-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-muted">
            <tr>
              <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-surface-border bg-surface-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                Feature
              </th>
              {cards.map((card) => (
                <th
                  key={card.slug}
                  className="min-w-[180px] border-b border-surface-border px-4 py-3 text-center"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-text">
                      {card.name}
                    </div>
                    <div className="text-xs font-normal text-text-muted">
                      {getIssuerDisplayName(card.issuer)}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Network & Tier */}
            <tr className="border-b border-surface-border">
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface px-4 py-3 font-medium text-text">
                Network
              </td>
              {cards.map((card) => (
                <td
                  key={card.slug}
                  className="px-4 py-3 text-center text-text"
                >
                  {NETWORK_LABELS[card.network] ?? card.network}
                </td>
              ))}
            </tr>
            <tr className="border-b border-surface-border bg-surface-muted/50">
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface-muted/50 px-4 py-3 font-medium text-text">
                Tier
              </td>
              {cards.map((card) => (
                <td
                  key={card.slug}
                  className="px-4 py-3 text-center text-text"
                >
                  {TIER_LABELS[card.tier] ?? card.tier}
                </td>
              ))}
            </tr>

            {/* Dynamic comparison fields */}
            {comparisonFields.map((field, idx) => {
              const isWinnerRow = winners[field.key] !== null;
              return (
                <tr
                  key={field.key}
                  className={clsx(
                    "border-b border-surface-border",
                    idx % 2 === 0 ? "bg-surface" : "bg-surface-muted/50"
                  )}
                >
                  <td
                    className={clsx(
                      "sticky left-0 z-10 border-r border-surface-border px-4 py-3 font-medium text-text",
                      idx % 2 === 0 ? "bg-surface" : "bg-surface-muted/50"
                    )}
                  >
                    {field.label}
                  </td>
                  {cards.map((card) => {
                    const value = field.getValue(card);
                    const isWinner =
                      isWinnerRow && winners[field.key] === card.slug;
                    return (
                      <td
                        key={card.slug}
                        className={clsx(
                          "px-4 py-3 text-center",
                          isWinner
                            ? "bg-emerald-50 font-semibold text-emerald-700"
                            : "text-text"
                        )}
                      >
                        {formatFieldValue(value, field.format)}
                        {isWinner && (
                          <span className="ml-1.5 inline-block text-xs text-emerald-500">
                            Best
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Fee Waiver */}
            <tr className="border-b border-surface-border">
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface px-4 py-3 font-medium text-text">
                Fee Waiver
              </td>
              {cards.map((card) => (
                <td
                  key={card.slug}
                  className="px-4 py-3 text-center text-text"
                >
                  {card.fees.waiverCondition ?? "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Categories */}
      <div className="w-full overflow-x-auto rounded-lg border border-surface-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-muted">
            <tr>
              <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-surface-border bg-surface-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                Categories
              </th>
              {cards.map((card) => (
                <th
                  key={card.slug}
                  className="min-w-[180px] border-b border-surface-border px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                  {card.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface px-4 py-3 font-medium text-text">
                Tags
              </td>
              {cards.map((card) => (
                <td key={card.slug} className="px-4 py-3 text-center">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {card.categories.map((cat) => (
                      <Badge key={cat} variant="default">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Category Reward Rates */}
      {(() => {
        const allCategories = Array.from(
          new Set(
            cards.flatMap((c) =>
              c.rewards.categoryRates.map((r) => r.category)
            )
          )
        );

        if (allCategories.length === 0) return null;

        return (
          <div className="w-full overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-surface-muted">
                <tr>
                  <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-surface-border bg-surface-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Reward Rates
                  </th>
                  {cards.map((card) => (
                    <th
                      key={card.slug}
                      className="min-w-[180px] border-b border-surface-border px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted"
                    >
                      {card.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCategories.map((cat, idx) => (
                  <tr
                    key={cat}
                    className={clsx(
                      "border-b border-surface-border",
                      idx % 2 === 0 ? "bg-surface" : "bg-surface-muted/50"
                    )}
                  >
                    <td
                      className={clsx(
                        "sticky left-0 z-10 border-r border-surface-border px-4 py-3 font-medium capitalize text-text",
                        idx % 2 === 0 ? "bg-surface" : "bg-surface-muted/50"
                      )}
                    >
                      {cat}
                    </td>
                    {cards.map((card) => {
                      const rate = card.rewards.categoryRates.find(
                        (r) => r.category === cat
                      );
                      return (
                        <td
                          key={card.slug}
                          className="px-4 py-3 text-center text-text"
                        >
                          {rate ? (
                            <span>
                              {rate.rate}x
                              {rate.description && (
                                <span className="block text-xs text-text-muted">
                                  {rate.description}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-text-muted">--</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* Pros, Cons, Ideal For */}
      <div className="w-full overflow-x-auto rounded-lg border border-surface-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-muted">
            <tr>
              <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-surface-border bg-surface-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                Summary
              </th>
              {cards.map((card) => (
                <th
                  key={card.slug}
                  className="min-w-[180px] border-b border-surface-border px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                  {card.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Pros */}
            <tr className="border-b border-surface-border">
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface px-4 py-3 align-top font-medium text-text">
                Pros
              </td>
              {cards.map((card) => (
                <td
                  key={card.slug}
                  className="px-4 py-3 align-top text-text"
                >
                  {card.pros.length > 0 ? (
                    <ul className="space-y-1">
                      {card.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0 text-emerald-500">
                            +
                          </span>
                          <span className="text-sm">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-text-muted">N/A</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Cons */}
            <tr className="border-b border-surface-border bg-surface-muted/50">
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface-muted/50 px-4 py-3 align-top font-medium text-text">
                Cons
              </td>
              {cards.map((card) => (
                <td
                  key={card.slug}
                  className="px-4 py-3 align-top text-text"
                >
                  {card.cons.length > 0 ? (
                    <ul className="space-y-1">
                      {card.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0 text-accent">
                            -
                          </span>
                          <span className="text-sm">{con}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-text-muted">N/A</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Ideal For */}
            <tr className="border-b border-surface-border">
              <td className="sticky left-0 z-10 border-r border-surface-border bg-surface px-4 py-3 align-top font-medium text-text">
                Ideal For
              </td>
              {cards.map((card) => (
                <td
                  key={card.slug}
                  className="px-4 py-3 align-top text-text"
                >
                  {card.idealFor.length > 0 ? (
                    <ul className="space-y-1">
                      {card.idealFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0 text-accent">
                            &bull;
                          </span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-text-muted">N/A</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
