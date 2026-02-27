import Link from "next/link";
import { CreditCard } from "@/types";
import { formatCurrency, getIssuerDisplayName } from "@/lib/utils";
import { NETWORK_LABELS, TIER_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { CardImage } from "./CardImage";

export function CardTile({ card }: { card: CreditCard }) {
  return (
    <Link
      href={`/cards/${card.slug}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-[var(--color-accent)]/30 hover:shadow-md"
    >
      {/* Card image */}
      <div className="mb-4 overflow-hidden rounded-lg">
        <CardImage
          name={card.name}
          issuer={card.issuer}
          network={card.network}
          className="h-auto w-full"
        />
      </div>

      {/* Card info */}
      <div className="flex-1">
        <h3 className="font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-accent)]">
          {card.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {getIssuerDisplayName(card.issuer)} &middot; {NETWORK_LABELS[card.network]}
        </p>

        {card.rating && (
          <div className="mt-2">
            <StarRating rating={card.rating} size="sm" showValue />
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="outline">{TIER_LABELS[card.tier]}</Badge>
          {card.categories.slice(0, 2).map((cat) => (
            <Badge key={cat} className="capitalize">{cat}</Badge>
          ))}
        </div>
      </div>

      {/* Fee info */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="text-xs text-gray-500">Annual Fee</span>
          <p className="text-sm font-semibold">
            {card.fees.annual === 0 ? "FREE" : formatCurrency(card.fees.annual)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Reward Rate</span>
          <p className="text-sm font-semibold">{card.rewards.baseEarnRate}x</p>
        </div>
      </div>
    </Link>
  );
}
